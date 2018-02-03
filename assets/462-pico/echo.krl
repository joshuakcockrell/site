ruleset echo {
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
  
  // Rule named hello that responds to a echo::hello event 
  // by returning a directive named say and the option 
  // something set to Hello World.
  rule hello {
    select when echo hello
    send_directive("say", {"something": "Hello World"})
  }
  
  // Rule named message that responds to a echo:message 
  // event with an attribute input by returning a directive named 
  // say with the option something set to the value of the input attribute.
  
  rule echo {
    select when echo message input re#(.*)#
    setting(parsedInput)
    send_directive("say", {"something":parsedInput})
  }
  
  
  
}