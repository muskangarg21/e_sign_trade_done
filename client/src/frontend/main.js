export default function validate(values) {

    let errors = {};
  
    if (!values.name) {
      errors.name = "Field Missing";
    }
    // if (!values.country) {
    //   errors.country = "Field Missing";
    // }
    // if (!values.nationality) {
    //   errors.nationality = "Field Missing";
    // }
    // if (!values.emailId) {
    //   errors.emailId = "Field Missing";
    // }
    console.log(errors)
    return errors;
  }  