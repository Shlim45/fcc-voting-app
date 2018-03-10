const form = document.querySelector('form');
const options   = form.querySelector('.options');
const editOptions   = form.querySelector('.edit-options');
const addButton = form.querySelector('.add-option');
const opts = ['', ''];

function generateOptions(options = []) {
    return options.map((option, index) => {
        const optionName = `option${index}`;
        return `
            <div class="option">
                <label for=${optionName}>Option ${index+1}</label>
                <input class="form-control" type="text" maxlength="30" name="options" id=${optionName} placeholder="option ${index+1}" />
            </div>
        `;
        }).join('');
}

if (options) {
    options.innerHTML = generateOptions(opts);
}

function newOption(opts) {
    const index = opts.length;
    const optionName = `option${index}`;
    
    const newOption = document.createElement('div');
    newOption.classList.add('option');
    newOption.innerHTML = `
        <div class="option">
            <label for=${optionName}>Option ${index+1}</label>
            <input class="form-control" type="text" maxlength="30" name="options" id=${optionName} placeholder="option ${index+1}" />
        </div>
    `;
    return newOption;
}

function addOption(newOption, opts, output) {
    output.appendChild(newOption);
    return opts.push('');
}

addButton.addEventListener('click', (e) => {
    const output = options || editOptions;
    let optionArray = opts;
    if (editOptions) {
        optionArray = Array.from(editOptions.children);
    }
    addOption(newOption(optionArray), optionArray, output);
});