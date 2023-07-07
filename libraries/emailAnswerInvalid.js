import isEmailValid from './isEmailValid.js';

const emailAnswerInvalid = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == 'Email') {
      const answer = answers.find((answer) => answer.questionId == question.id);

      // if blank answer on not required question
      if (question.required === false) {
        if (
          answer === undefined ||
          answer.value === undefined ||
          answer.value === null
        ) {
          return false;
        }
      }

      // check whether email entered is a valid email
      if (answer) {
        if (!isEmailValid(answer.value)) {
          return true;
        }
      }
    }
  });

  return found;
};

export default emailAnswerInvalid;
