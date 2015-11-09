/**
 * Created by mot on 11/8/15.
 */


module.exports = {
  ctoDetails: function(req, res) {
    var isValid = true;
    if ((!req.param("id"))) {
      isValid = false;
    }
    var id = parseInt(req.param("id"));
    if (id === NaN) {
      isValid = false;
    }
    if (!isValid) {
      return res.redirect('/');
    }
    sails.log(req.param('id'));
    User.findOne({id: parseInt(req.param('id'))}).exec(function(err, user) {
      res.view('cto-detail', {
        id: id,
        companyName: user.company || '未知公司',
        nickname: user.name || '',
        title:'CTO-detail',
        content: 'CTO detail page'
      });
    });
  },


  userProfile: function(req,res){
    console.log("???");
    if(req.param("id")){
      var id = req.param("id");
      res.view('ProfileGoal',{
        userId:id
      })
    }
    else{
      res.view('ProfileGoal',{})
    }
  },

  goalDetail : function(req,res){
    if (!req.param("id")) {
      res.redirect('/');
    }
    else{
      var id = req.param("id");
      res.view('GoalDetailView',{
        id:id
      })
    }
  },

   groupDetail: function (req, res) {
     if (!req.param("id")) {
        res.redirect('/');
     }

     else{
       var id = req.param("id");
       res.view('GroupDetails',{
         id:id
       })
     }
   }
};
