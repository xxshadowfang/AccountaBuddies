/**
 * Created by mot on 10/15/15.
 */

var Util = Util || {};
Util.debug = false;
Util.id = null;

Util.isInt = function(str){
  var n = ~~Number(str);
  return String(n) === str && n >= 0;
};


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

Util.getUser = function(callback){
  $.ajax({
    method:'GET',
    url :'/user/get'}).done(function(body){
    if (body.success) {
      console.log("get user information succeeded");
    }
    else {
      console.log(body.content);
    }
    callback(body);
  })
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
      description:text,
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



Util.deleteGoal = function(id,callback){
  $.ajax({
    method:'POST',
    url:'/goal/delete?id='+id,
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


Util.createGroup = function(name,motto,description,password,callback){
  $.ajax({
    method:'POST',
    url:'/group/create',
    data:{
      name:name,
      motto:motto,
      description: description,
      password: password

    }
  }).done(function(body){
    if(body.success){
      console.log('createGroup succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)


  })
}


Util.getGoalList = function(callback){
  $.ajax({
    method:'GET',
    url:'/goal/list',
    data : {}
  }).done(function(body){
    if(body.success){
      console.log('get goal list succeeded');
    }
    else{
      console.log(body.content)
    }
    callback(body)

  })

}


Util.getGoal = function(id,callback){
  $.ajax({
    method:'GET',
    url:'/goal/find?id='+id,
    data : {}
  }).done(function(body){
    if(body.success){
      console.log('get goal succeeded');
    }
    else{
      console.log(body.content)
    }
    callback(body)

  })

}


Util.deleteGroup = function(GroupId,callback){
  $.ajax({
    method:'POST',
    url:'/group/delete',
    data:{
      GroupID:GroupId
    }
  }).done(function(body){
    if(body.success){
      console.log('deleteGroup succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)

  })
}

Util.joinGroup = function(id,password,callback){
  $.ajax({
    method:'POST',
    url:'/group/join',
    data:{
      id:id,
      password: password

    }
  }).done(function(body){
    if(body.success){
      console.log('join Group succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)


  })
};

Util.leaveGroup = function(id,callback){
  $.ajax({
    method:'POST',
    url:'/group/leave',
    data:{
      id:id
    }
  }).done(function(body){
    if(body.success){
      console.log('leave Group succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)


  })
}


Util.findGroup = function(id,callback){
  $.ajax({
    method:'GET',
    url:'/group/find?id='+id,
    data:{}
  }).done(function(body){
    if(body.success){
      console.log('find Group succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)


  })
}

Util.getAllGroups = function(callback){
  $.ajax({
    method:'GET',
    url:'/group/list/0',
    data:{
    }
  }).done(function(body){
    if(body.success){
      console.log('get all Groups succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)


  })
}

Util.GetJoinGroupList = function(callback){
  $.ajax({
    method:'GET',
    url:'/group/list/1',
    data:{
    }
  }).done(function(body){
    if(body.success){
      console.log('get joined Groups succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)
  })
}

Util.getGroupMembers = function(id,callback){
  $.ajax({
    method:'GET',
    url:'/group/members/?id='+id,

  }).done(function(body){
    if(body.success){
      console.log('get joined Groups succeeded')
    }
    else{
      console.log(body.content)
    }
    callback(body)
  })
}


Util.viewUser = function (id,callback){
  $.ajax({
    method:"GET",
    url: "/user/get?id="+id
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


Util.viewGoals = function (id,callback){
  $.ajax({
    method:"GET",
    url: "/goal/list?id="+id
  })
    .done(function(body){
      if(body.success){
        console.log("get goals succeeded");
      }

      else{
        console.log(body.content);
      }

      callback(body);
    })
}



Util.updateStep = function (id,amountWorked,callback){
  $.ajax({
    method:"POST",
    url: "/goal/updateStep",
    data:{id:id,amountWorked:amountWorked}
  })
    .done(function(body){
      if(body.success){
        console.log("update step succeeded");
      }
      else{
        console.log(body.content);
      }
      callback(body);
    })
}
