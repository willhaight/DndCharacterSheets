// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn4VF9q_ALn5nGHoL9BW3HRir1YeUrtco",
    authDomain: "dungeonapp-3f80a.firebaseapp.com",
    projectId: "dungeonapp-3f80a",
    storageBucket: "dungeonapp-3f80a.appspot.com",
    messagingSenderId: "532180053044",
    appId: "1:532180053044:web:8bf63c2be8f651010aee61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firestore initialized');


//navbar handling
let navbar = document.getElementsByClassName('header')[0];

navbar.onclick = function () {
    // Toggle between 'expanded' and 'shrunk' classes
    if (navbar.classList.contains('expanded')) {
        navbar.classList.remove('expanded');
        navbar.classList.add('shrunk');
        navbar.children[1].style.display = 'none'
        navbar.children[2].style.display = 'none'
    } else {
        navbar.classList.remove('shrunk');
        navbar.classList.add('expanded');
        navbar.children[1].style.display = 'block'
        navbar.children[2].style.display = 'block'
    }
};

//pull sheet data

let updateButton = document.getElementById('sheetSelector')

updateButton.onclick = async function () {
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "none";
    }
    document.getElementById('modal').style.display = 'flex';

    // Fetch abilities from Firestore
    const characterListContainer = document.getElementById('characterList');
    characterListContainer.innerHTML = ''; // Clear existing options

    const querySnapshot = await getDocs(collection(db, 'characters'));
    querySnapshot.forEach((doc) => {
        let characterOption = document.createElement('div');
        characterOption.className = 'character-option';
        characterOption.textContent = doc.id;
        characterOption.onclick = () => {
            fillCharacterData(doc.id);
        };
        characterListContainer.appendChild(characterOption);
    });
}

async function fillCharacterData(charName) {
    document.getElementById('characterList').innerHTML = "";
    document.getElementById('abilityList').innerHTML = "";
    document.getElementById('expandedCard').innerHTML = "";

    const docRef = doc(db, 'characters', charName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const sheetArea = document.getElementById('sheetArea');

        sheetArea.innerHTML = `<div class="content">
            <div class="subClass">
                <h1>${charName}</h1>
            </div>

            <div class="subClass">
                <h2>Class: ${data.classTitle}</h2>
                <h2>Race: ${data.race}</h2>
                <h2>Age: ${data.age}</h2>
            </div>

            <div class="subClass">
                <h3>Level: ${data.level}</h3>
                <h3>Health: <p id="healthStorage" contenteditable="true">${data.hp}</p><p>/${data.ogHp}</p></h3>
                <h3>Armor Class: ${data.ac}</h3>
            </div>

            <div class="subClass">
                <h3>Intelligence: ${data.int}</h3>
                <h3>Wisdom: ${data.wis}</h3>
                <h3>Arcana: ${data.arcana}</h3>
            </div>

            <div class="subClass">
                <h3>Charisma: ${data.char}</h3>
                <h3>Perception: ${data.per}</h3>
                <h3>Investigation: ${data.inv}</h3>
            </div>

            <div class="subClass">
                <h3>Strength: ${data.str}</h3>
                <h3>Dexterity: ${data.dex}</h3>
                <h3>Athletics: ${data.ath}</h3>
                <h3>Acrobatics: ${data.acr}</h3>
            </div>

            <div class="subClass">
                <h4>${data.desc}</h4>
            </div>

            <div class="subClass">
                <h4>${data.backstory}</h4>
            </div>
        </div>`;

        const hpUpdater = document.getElementById('healthStorage');

        hpUpdater.oninput = async function () {
            let trueHealth = document.getElementById('healthStorage').innerText;

            // Use a regular expression to remove non-numeric characters
            trueHealth = trueHealth.replace(/[^0-9]/g, '');

            // Convert the cleaned string to an integer
            let finalTrueHealth = parseInt(trueHealth, 10);

            try {
                // Check if the document already exists
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Document exists, update it
                    console.log('Document exists, updating it.');
                } else {
                    // Document does not exist, create it
                    console.log('Document does not exist, creating it.');
                }

                // Create or overwrite the document in the Firestore collection
                await setDoc(docRef, {
                    classTitle: data.classTitle,
                    race: data.race,
                    age: data.age,
                    level: data.level,
                    ac: data.ac,
                    hp: finalTrueHealth,
                    ogHp: data.ogHp,
                    int: data.int,
                    wis: data.wis,
                    arcana: data.arcana,
                    char: data.char,
                    per: data.per,
                    inv: data.inv,
                    str: data.str,
                    dex: data.dex,
                    ath: data.ath,
                    acr: data.acr,
                    backstory: data.backstory,
                    desc: data.desc,
                    spells: data.spells
                });

                console.log('Document written with ID: ', charName);

            } catch (e) {
                console.error('Error adding document: ', e);
            }
        };

        document.getElementById('coaster').innerHTML = "";

        for (let i = 0; i < data.spells.length; i++) {
            fillAbilityData(data.spells[i]);
        }

        document.getElementById('modal').style.display = 'none'; // Close the modal after selection

        let contentElements = document.getElementsByClassName('content');
        for (let i = 0; i < contentElements.length; i++) {
            contentElements[i].style.display = "flex"; // Show the main content again
        }

    } else {
        console.log('No such document!');
    }
}

//Ability carosel

async function fillAbilityData(abilityName) {
    document.getElementById('characterList').innerHTML = "";
    document.getElementById('abilityList').innerHTML = "";
    document.getElementById('expandedCard').innerHTML = "";
    const docRef = doc(db, 'abilities', abilityName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';

        cardContainer.innerHTML = `
            <div class="cardHeader">
                <h3>${abilityName}</h3>
            </div>
            <div class="spellStats">
                <p>Level: ${data.level}</p>
                <p>Type: ${data.type}</p>
                <p>Damage Type: ${data.dmgType}</p>
            </div>
        `;

        cardContainer.onclick = function () {
            let contentElements = document.getElementsByClassName('content');
            for (let i = 0; i < contentElements.length; i++) {
                contentElements[i].style.display = "none";
            }
            document.getElementById('modal').style.display = 'flex';
            document.getElementById('abilityList').innerHTML = "";
            document.getElementById('expandedCard').innerHTML = `
                <div class="card">
                    <div class="cardHeader">
                        <h3>${abilityName}</h3>
                    </div>
                    <div class="spellStats">
                        <p>Level: ${data.level}</p>
                        <p>Type: ${data.type}</p>
                        <p>Damage Type: ${data.dmgType}</p>
                    </div>
                    <div class="spellDesc">
                        <p>${data.desc}</p>
                    </div>
                    <div class="spellDmgRoll">
                        <p>${data.dmgRoll}</p>
                    </div>
                    <div class="deleteCard">
                    </div>
                </div>`;
        };

        document.getElementById('coaster').appendChild(cardContainer);
    } else {
        console.log('No such document!');
    }

    document.getElementById('modal').style.display = 'none'; // Close the modal after selection
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "flex"; // Show the main content again
    }
}



//exit modal

document.getElementById('exitButton').onclick = function () {
    document.getElementById('characterList').innerHTML = ""
    document.getElementById('abilityList').innerHTML = ""
    document.getElementById('expandedCard').innerHTML = ""
    document.getElementById('modal').style.display = 'none'; // Close the modal after selection
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "flex"; // Show the main content again
    }
}