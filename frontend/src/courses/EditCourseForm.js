import React, { useState } from "react";

/** Course form.
 *
 * Shows form and manages update to course on changes.
 * On submission:
 * - calls patch courses api
 * - edits parent courseData
 * - removes form from page
 */

function EditCourseForm({ id, title, about, setActive, changeCourse}) {
    const [formData, setFormData] = useState({
        title: title,
        about: about
    })



  /** Handle form submit:
   *
   * Calls YouTeachApi, edits courseList, and unrenders form
   */

  async function handleSubmit(e) {
    try{
        e.preventDefault();
        await changeCourse(id, formData);
        setActive(false)
    }catch(err){
        console.error("Problem editing course", err);
    }
  }


  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return(
    <form onSubmit={handleSubmit}>
        <div className="formGroup">
            <label>Title</label>
            <input
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                />
        </div>
        <div className="formGroup">
            <label>About</label>
            <input
                name="about"
                className="form-control"
                value={formData.about}
                onChange={handleChange}/>
        </div>
        <button type = "submit" className = "btn btn-primary"> Submit</button>
    </form>
  )

}

export default EditCourseForm;