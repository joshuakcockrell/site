ruleset track_trips {
  meta {
    name "Hello World"
    description <<
A first ruleset for the Quickstart
>>
    author "Josh Cockrell"
    logging on
    shares echo
  }
    
  
  global {
    echo = function(obj) {
      msg = "Hello " + obj;
      msg
    }
  }
  
  // track_trips that contains a rule called process_trip that 
  // also responds to the echo:message event with an attribute 
  // mileage. This rule should return a directive named trip with the option length set to the value of the mileage attribute.
  
  rule echo {
    select when echo message mileage re#(.*)#
    setting(parsedInput)
    send_directive("trip", {"length":parsedInput})
  }
  
}


