import React, { useState } from "react";

/** Unit title form.
 *
 * Shows form and manages update to course on changes.
 * On submission:
 * - calls patch courses api
 * - edits parent courseDetail
 * - removes form from page
 */

function LessonTitleEditForm({ id, title, setActive, changeTitle}) {
    const [formTitle, setFormTitle] = useState(title)



  /** Handle form submit:
   *
   * Calls YouTeachApi, edits courseDetail, and unrenders form
   */

  async function handleSubmit(e) {
    try{
        e.preventDefault();
        await changeTitle(id, formTitle);
        setActive(false)
    }catch(err){
        console.error("Problem editing unit", err);
    }
  }


  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormTitle(value);
  }

  return(
    <form onSubmit={handleSubmit}>
        <div className="formGroup">
            <label>Title</label>
            <input
                name="title"
                className="form-control"
                value={formTitle}
                onChange={handleChange}
                />
        </div>
        <button type = "submit" className = "btn btn-primary"> Submit</button>
    </form>
  )

}

export default LessonTitleEditForm;