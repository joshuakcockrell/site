ruleset track_trips {
  meta {
    name "Hello World"
    use module io.picolabs.subscription alias sub
    description <<
Store trips for vehicles
>>
    author "Josh Cockrell"
    logging on
    shares __testing, hello
  }
    
  global {
    
    long_distance = 100;
    
    __testing = { "queries": [ { "name": "__testing" } ],
                  "events": [ ] }
  }
  
  // initialize a pico entity variable //
  rule init{
    select when wrangler ruleset_added where rids >< meta:rid
    always{
      ent:trips := [];
      ent:name := "";
    }
  }
  
  
  rule auto_accept {
    select when wrangler inbound_pending_subscription_added

    always {
      ent:name := event:attr("name");
      raise wrangler event "pending_subscription_approval"
        attributes event:attrs
    }
  }
  
  rule forward_data {
    select when wrangler subscription_added
    pre {
      subscription = sub:established("Tx_role", "fleet");
    }
    event:send({
    "eci": subscription[0]{"Tx"},
    "domain": "forward", "type": "data",
    "attrs": event:attrs
    });
  }
  
  /////////////////////////////////////////
  
  rule store_trip {
    select when car new_trip mileage re#(.*)#
    setting(parsedInput)
    pre {
      trip = {"length":parsedInput, 
      "name": ent:name, 
      "time": time:now(), 
      "longTrip": parsedInput.as("Number") > long_distance }
    }
    
    send_directive("trip", trip);
    
    always {
      // Add trip to collection
      ent:trips := ent:trips.append(trip);
    }
  }
  
  rule get_trips {
    select when get trips
    foreach sub:established("Tx_role", "fleet") setting (fleet)
    every {
      send_directive("output", {
        "name": ent:name.defaultsTo("BLANK NAME"), 
        "trips": ent:trips})
      event:send({
        "eci": fleet{"Tx"},
        "domain": "trip", "type": "details",
        "attrs": {"name": ent:name, "trips": ent:trips}
      });
    }
  }
}








