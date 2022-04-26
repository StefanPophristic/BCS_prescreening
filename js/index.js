function make_slides(f) {
  var   slides = {};
  var participationStatus = 0;
  var disqualifyCounter = 3;

  slides.bot = slide({
    name : "bot",
    start: function() {
      $('.err1').hide();
      $('.err2').hide();
      $('.disq').hide();

      document.getElementById("s").innerHTML = "Molimo vas popunite nedostajuće slovo poslednje reči ove rečenice:";
      document.getElementById("q").innerHTML = "Ja volim svoju sestr";
    },
    button : function() {
      exp.text_input = document.getElementById("text_box").value;
      console.log(exp.text_input);
      if((disqualifyCounter == 3) && (exp.text_input == "u" | exp.text_input == "U" |
      exp.text_input == "u." | exp.text_input == "U." )){
        console.log("enter");
        exp.data_trials.push({
          "slide_number": exp.phase,
          "trial_type" : "bot_check",
          "image" : exp.listener,
          "response" : [0,exp.text_input]
        });
        exp.go();
      }
      else {
        console.log("else");
        exp.data_trials.push({
          "slide_number": exp.phase,
          "trial_type" : "bot_check",
          "image" : exp.listener,
          "response" : [0,exp.text_input]
        });
        if (disqualifyCounter == 3){
          $('.err1').show();
        }if (disqualifyCounter == 2){
          $('.err1').hide();
          $('.err2').show();
        }if (disqualifyCounter == 1){
          $('.err2').hide();
          $('.disq').show();
          $('.button').hide();
        }
        disqualifyCounter = disqualifyCounter - 1;
      }
    },
  });

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.description = slide({
    name: "description",
    start: function() {
      $(".err").hide();
    },
    // button2: function() {
    //   console.log("geri git")
    //   //exp.go("description");
    // },
    button : function() {

      var qual = $('input[name="qualify"]:checked').val();
      var agr = $('input[name="agree"]:checked').val()
      console.log(qual);
      console.log(agr);

      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.data_trials.push({
        "trial_type" : "description",
        'qualify': qual,
        'agree': agr,
      });

      if (qual=="Yes" & agr=="Yes") {
        participationStatus = 1;
        console.log("yes")
        exp.go();
      } else {
        console.log("no")
        exp.go("thanks");
      }
      //exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.info = slide({
    name: "info",
    start: function() {
      exp.email = document.getElementById("email").value;
    },
    button : function() {
      exp.email = document.getElementById("email").value;
      exp.data_trials.push({
        "trial_type" : "info",
        'email' : exp.email
      });
        exp.go();
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {

      $(".participationYes").hide();
      $(".participationNo").hide();

      if (participationStatus == 1) {
        $(".participationYes").show();
      } else {
        $(".participationNo").show();
      }

      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          //"condition" : exp.condition,
          //"subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      proliferate.submit(exp.data);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  //exp.condition = _.sample(["condition 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["bot", "i0", "description", "info", 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
