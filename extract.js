var modInfos;
var selectedFormat;

function handleClick() {
    Swal.fire({
        title: 'Choose the format',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'JSON',
        cancelButtonText: 'Plain Text',
        showCloseButton: true,
        closeButtonAriaLabel: 'Abort'
    }).then((resultFormat) => {
        if (resultFormat.isConfirmed) {
            selectedFormat = 'JSON';
        } else if (resultFormat.dismiss === Swal.DismissReason.cancel) {
            selectedFormat = 'Text';
        }
        showOptionsModal();
    });
}

function showOptionsModal() {
    var selectElement = document.createElement('select');
    selectElement.innerHTML = `
      <option value="Name">Name</option>
      <option value="Link">Link</option>
      <option value="Combined">Name + Link</option>
    `;

    var swalOptions = {
        title: 'Choose the option',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        closeButtonAriaLabel: 'Close',
        showLoaderOnConfirm: true,
        html: selectElement,
    };

    Swal.fire(swalOptions).then((resultOption) => {
        if (resultOption.isConfirmed) {
            var selectedOption = selectElement.value;
            var informationToCopy;
            if (selectedOption === 'Name') {
                informationToCopy = modInfos.map(mod => mod.name);
            } else if (selectedOption === 'Link') {
                informationToCopy = modInfos.map(mod => mod.href);
            } else if (selectedOption === 'Combined') {
                informationToCopy = modInfos.map(mod => ({ Name: mod.name, Link: mod.href }));
            }

            if (selectedFormat === 'Text') {
                if (selectedOption === 'Combined') {
                    informationToCopy = informationToCopy.map(mod => `Name: ${mod.Name}\nLink: ${mod.Link}`).join('\n\n');
                } else {
                    informationToCopy = informationToCopy.join('\n');
                }
            }

            if (selectedFormat === 'JSON') {
                informationToCopy = JSON.stringify(informationToCopy, null, 2);
            }

            copyToClipboard(informationToCopy, selectedFormat === 'JSON');
        }
    });
}

function copyToClipboard(text, isJson) {
    if (isJson) {
        try {
            var jsonData = JSON.parse(text);
            text = JSON.stringify(jsonData, null, 2);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    if (!isJson) {
        text = text.replace(/\n/g, '\r\n');
    }

    navigator.clipboard.writeText(text).then(function () {
        console.log('Mod list copied to clipboard.');
    }).catch(function (err) {
        console.error('Error copying to clipboard:', err);
    });
}

function processMods() {
    var elements = document.querySelectorAll('html body div#__next div.page-contents div.container main._modpack__bodyMain__lcUqM div._modpack__section__q4UHR div div.PackMods_mods__3nChp a.PackMods_mod__haWmc.no-link-style');

    if (elements.length > 0) {
        console.log(`[${elements.length}] Mods found!`);

        modInfos = [];
        
        elements.forEach(function (element, index) {
            var href = element.getAttribute('href');
            var name = element.querySelector('.PackMods_title__NFDx5').innerText;
        
            modInfos.push({
                href: href,
                name: name
            });
        });

        var statsDiv = document.querySelector('html body div#__next div.page-contents div.container header._modpack__packHeader__vlEs5 div._modpack__about__5pT3l div._modpack__stats__vQgql');
        var modCountDiv = document.createElement('div');
        modCountDiv.innerHTML = `
            <div>
                <div class="Stat_title__44m3v">Modcount</div>
                <div class="Stat_value__5pvLP">${modInfos.length}</div>
            </div>
        `;
        statsDiv.appendChild(modCountDiv);

        var newButton = document.createElement('div');
        newButton.className = '_modpack__navItem__PFRar';
        newButton.innerHTML = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M400 0H160C119 0 83 36 83 80v352c0 44 36 80 80 80h240c41 0 77-36 77-80V80c0-44-36-80-80-80zm40 432c0 22.1-17.9 40-40 40H96c-22.1 0-40-17.9-40-40V80c0-22.1 17.9-40 40-40h64v88c0 13.3 10.7 24 24 24h88v312zM192 296h24v40c0 13.3 10.7 24 24 24h80v24H192v-88zm128-56v-24c0-13.3-10.7-24-24-24H96V96H80v336c0 13.3 10.7 24 24 24h312v-24H320z"></path>
            </svg>
            Copy Modlist`;

        newButton.addEventListener('click', function() {
            handleClick();
        });

        var menu = document.querySelector('._modpack__navMain__42nGa');

        menu.appendChild(newButton);
    } else {
        console.log('No Mods have been found..');
    }
}

setTimeout(processMods, 4000);