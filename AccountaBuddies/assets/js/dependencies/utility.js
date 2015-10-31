/**
 * Created by mot on 10/15/15.
 */

var Util = Util || {};
Util.debug = false;
Util.id = null;


Util.login = function(username,password,callback){
     $.ajax({
       method: "POST",
       url: "/user/login",
       data: {username: username, password: password}
     })
       .done(function (body) {
         if (body.success) {
           console.log("login succeed");
         }
         else {
           console.log(body.content);
         }
         callback(body);
       })

};

Util.logout = function(callback){
  $.ajax({
    method: "GET",
    url: "/user/logout",
    data: {}

  }).done(function(body){
    if(body.success){
      console.log("logout succeed");
    }
    else{
      console.log(body.content);
    }
    callback(body);
  })
};


Util.register = function(username,password,firstName,lastName,callback){
    $.ajax({
      method: "POST",
      url: "/user/register",
      data: {username: username, password: password,firstName:firstName,lastName:lastName}
    })
      .done(function (body) {
        if (body.success) {
          console.log("register succeeded");
        }
        else {
          console.log(body.content);
        }
        callback(body);
      })
      .fail(function () {

      })
      .always(function () {

      });
};


Util.userSetting = function(params,callback){
  $.ajax({
    method:"POST",
    url: "/user/setting",
    data: params
  })
    .done(function(body){
      if(body.success){
        console.log("setting succeeded");
      }

      else{
        console.log(body.content);
      }

      callback(body);
    })
};


Util.user = function (callback){
  $.ajax({
    method:"GET",
    url: "/user/get"
  })
    .done(function(body){
      if(body.success){
        console.log("get user succeeded");
      }

      else{
        console.log(body.content);
      }

      callback(body);
    })
}

Util.postGoal = function(name,text,steps,callback){
  $.ajax({
    method:'POST',
    url:'/goal/create',
    data:{
      name:name,
      text:text,
      steps:steps
    }
  }).done(function(body){
    if(body.success){
      console.log('goal posted');
    }
    else{
      console.log(body.content);
    }
    callback(body);
  })
};


Util.generateStep = function(title,points,goalDate){
  return {
    title:title,
    points:points,
    goalDate:goalDate
  }
};

Util.updateGoal = function(name,text,steps,id){
  $.ajax({
    method:'PUT',
    url:'/goal/update?id='+goalID,
    data:{
      name:name,
      text:text,
      steps:steps
    }
  }).done(function(body){
    if(body.success){
      console.log('goal updated');
    }
    else{
      console.log(body.content);
    }
    callback(body)
  })
}



Util.deleteGoal = function(id){
  $.ajax({
    method:'POST',
    url:'/goal/delete?goalID='+id,
    data:{}
  }).done(function(body){
    if(body.success){
      console.log('goal deleted')
    }
    else{
      console.log(body.content)
    }
    callback(body)
  })

}


Util.postComment = function(){

  //TO DO
}


Util.createGroup = function(name,motto,interests,privacy,groupInfo){
  $.ajax({
    method:'POST',
    url:'/group/create',
    data:{
      name:name,
      motto:motto,
      interests:interests,
      privacy:privacy,
      groupInfo:groupInfo
    }
  })
}


