<?php

class Questions_Controller extends Base_Controller {

  public function __construct() {
    parent::__construct();

    $this->filter('before', 'vendor_only')->only(array('create'));
  }

  public function action_create() {
    $question = new Question(array('contract_id' => Input::get('contract_id'),
                                   'question' => Input::get('question')));
    $question->vendor_id = Auth::user()->vendor->id;

    if ($question->validator()->passes()) {
      $question->save();
      return Response::json(array("status" => "success",
                                  "question" => $question->to_array(),
                                  "html" => View::make('partials.media.question')->with('question', $question)->render()));
    } else {
      return Response::json(array("status" => "error", "errors" => $question->validator()->errors->all()));
    }
  }

  public function action_answer() {
    $question = Question::find(Input::get('id'));
    $answer = trim(Input::get('answer'));

    if (!$question) return Response::json(array("status" => "question not found"));
    if ($question->contract->officer->user->id != Auth::user()->id &&
        !Auth::user()->officer->collaborates_on($question->contract->id)) return Response::json(array("status" => "not authorized"));

    if ($answer && $answer != "") {
      $question->answer = $answer;
      $question->answered_by = Auth::user()->officer->id;
      $question->save();
      return Response::json(array("status" => "success",
                                  "question" => $question->to_array(),
                                  "html" => View::make('partials.media.question')->with('question', $question)->render()));
    } else {
      return Response::json(array("status" => "error", "errors" => array('No answer provided.')));
    }

  }

}
