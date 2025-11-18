// List of operator names for the QC inspection app
// The array can be extended as new operators join the team.
// Attach the list of operators to the global window object so it can be
// accessed in non-module environments (e.g. file://). Using globals
// avoids import issues when running the app locally without a web server.
window.OPERATOR_LIST = [
  "Md Repon Hossen",
  "Khirul",
  "Sree Sukumar Shil",
  "Md Ashik Ali",
  "Salek Abdus",
  "Ahmod Naim",
  "Naim",
  "Md Tohidul Islam",
  "Mozid Mohammad Abdul",
  "Suman Mia",
  "Md Beltu Ali",
  "Abu Talib",
  "Aye Aye Aung",
  "Alamin",
  "Khin Hlaing San",
  "Khin Hnin Wai",
  "Shuhel",
  "Thet Mar Htwe"
];

/**
 * Populates a <select> element with operator names. The select must exist in the DOM.
 * @param {string} selectId The id of the select element to populate
 */
window.populateOperatorDropdown = function populateOperatorDropdown(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;

  // Retain a placeholder option if present
  const firstOption = el.querySelector('option');
  el.innerHTML = '';
  if (firstOption) el.appendChild(firstOption);

  window.OPERATOR_LIST.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    el.appendChild(opt);
  });
};
