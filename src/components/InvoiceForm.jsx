import React, { useState } from "react";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const templates = [
  {
    name: "OD Form",
    fields: [
      "Staff Name",
      "Date",
      "Place",
      "Department",
      "Staff Id",
      "Purpose",
      "From",
      "To",
      "No of Days",
    ],
    path: "/templates/od-form.docx", // Adjust the path based on your project structure
  },
];

const InvoiceForm = () => {
  const [template, setTemplate] = useState(null);
  const [values, setValues] = useState({});

  const handleTemplateChange = (event) => {
    const selectedTemplate = templates.find(
      (t) => t.name === event.target.value
    );
    setTemplate(selectedTemplate);
    setValues({});
  };

  const handleInputChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleDocxDownload = async () => {
    try {
      if (!template) {
        console.error("Template not selected");
        return;
      }

      const response = await fetch(template.path);
      if (!response.ok) {
        console.error("Failed to fetch template");
        return;
      }

      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);
      doc.setData(values);
      doc.render();

      const generatedBlob = doc.getZip().generate({ type: "blob" });
      saveAs(generatedBlob, "output.docx");
    } catch (error) {
      console.error("Error during document generation:", error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 id="title" className="text-center">
          EAS Form Generator
        </h1>
        <p id="description" className="text-center">
          Fill the form below to generate your EAS form
        </p>
      </header>
      <div className="form-wrap">
        <form id="survey-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label id="name-label" htmlFor="name">
                  Select a form
                </label>
                <select onChange={handleTemplateChange}>
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                {template &&
                  template.fields.map((field) => (
                    <div key={field}>
                      <label id={`${field}-label`} htmlFor={field}>
                        {field}
                      </label>
                      <input
                        className="form-control"
                        id={field}
                        type="text"
                        name={field}
                        value={values[field] || ""}
                        onChange={handleInputChange}
                        placeholder={field}
                      />
                      <br />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="row justify-content-end">
            <div className="col-md-6">
              {template && (
                <button
                  type="button" // Specify type as button to prevent form submission
                  className="btn btn-primary ms-auto"
                  onClick={handleDocxDownload}
                >
                  Download DOCX
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
