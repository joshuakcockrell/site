ruleset manage_fleet {
  meta {
    shares __testing, vehicles
    use module io.picolabs.subscription alias sub
  }
  global {
    __testing = { "queries": [ { "name": "__testing" }, {"name": "vehicles"} ],
              "events": [ ] }
    
    vehicles = function() {
      sub:established("Tx_role", "vehicle");
    }
  }
  
  rule init {
    select when wrangler ruleset_added where rids >< meta:rid
    always{
      ent:responded := 0;
      ent:vehicles := {};
      ent:trips := [];
    }
  }
  

  rule create_vehicle {
    select when create vehicle name re#(.*)#
    setting(parsedInput)
    send_directive("created vehicle", {"name":parsedInput})
    always {
      raise wrangler event "child_creation"
      attributes { 
        "name": parsedInput, 
        "color": "#e74c3c",
        "rids": ["io.picolabs.subscription", "track_trips"] };
    }
  }
  
  
  rule get_vehicles {
    select when get vehicles
    send_directive("output", {"values":vehicles()})
  }
  
  
  rule store_new_vehicle {
    select when wrangler child_initialized
    pre {
      the_vehicle = {"id": event:attr("id"), "eci": event:attr("eci")}
      name = event:attr("name");
      vehicle = { 
        "name" : name,
        "Rx_role": "fleet",
        "Tx_role": "vehicle",
        "channel_type": "subscription",
        "wellKnown_Tx" : event:attr("eci")
      }
    }
    every {
      send_directive(name);
    }
    always {
      
      ent:vehicles := ent:vehicles.defaultsTo({});
			ent:vehicles{[name]} := vehicle;

      raise wrangler event "subscription" attributes
      vehicle
    }
  }
  
  rule get_trips {
    select when start get_fleet_trips
    foreach vehicles() setting (v)
    every {
      event:send({
        "eci": v{"Tx"},
        "domain": "get", "type": "trips",
        "attrs": event:attrs
        });
    }
    always {
      ent:responded := 0;
      ent:trips := []; // Wipe trips clean
      // raise get event "trips"
    }
  }
  
  rule get_trips_response {
    select when get fleet_trips_response
    every {
      send_directive(
        "output", {
        "vehicles": vehicles().length(), 
        "responding": ent:responded,
        "report": ent:trips
        });
    }
  }
  
  rule trips_response {
    select when trip details
    pre {
      name = event:attr("name");
      trips = event:attr("trips");
    }
    always {
      ent:responded := ent:responded + 1;
      ent:trips := ent:trips.append({
        "name": name, 
        "trips": trips});
    }
  }
  
  rule save_rx {
    select when forward data
    pre {
      b = event:attrs.klog("Attrs:");
      name = event:attr("name").klog("NAME: ");
      Tx = event:attr("bus"){"Rx"}.klog("Rx: ");
      Rx = event:attr("bus"){"Tx"}.klog("Tx: ");
    }
    always {
      vehicle = ent:vehicles{[name]}.klog("Vehicle: ");
      ent:vehicles{[name]} := vehicle.put(["Rx"], Rx);
      ent:vehicles{[name]} := ent:vehicles{[name]}.put(["Tx"], Tx).klog("modified vehicle:");
    }
  }
  
  
  rule delete_vehicle {
    select when car unneeded_vehicle name re#(.*)#
    setting(parsedInput)
    pre {
      vehicle_name = parsedInput
      exists = ent:vehicles >< vehicle_name
      vehicle = ent:vehicles[vehicle_name];
    }
    every {
      send_directive("output", {"vehicle": vehicle});
    }
    
    always {
      
      ent:vehicles := ent:vehicles.delete([vehicle_name]);
      
      raise wrangler event "subscription_cancellation"
        attributes {"Rx": vehicle{"Rx"}};
        
      raise wrangler event "child_deletion"
        attributes {"name": vehicle{"name"}};
    }
  }
}
