var link = document.createElement("link");
var button = document.createElement("button");
var champion = document.querySelector(".Navigation .Action");
var search = champion.cloneNode(true);
var listRecent = search.querySelector(".Recent ul");
var listAll = search.querySelector(".All ul");
var iconWrapper = document.createElement("div");
var icon = document.createElement("i");

var map = {};

// fix user name
var user = document.querySelector(".Name").innerText;

if(user[0] == "[" && user[user.length - 1] == "]") {
    user = user.replace("[", "");
    user = user.replace("]", "");
}

addElements();
setTimeout(load, 100);

function load() {
    var addButton = document.querySelector(".GameMoreButton a");
    if(addButton != null) {
        addButton.onclick = function() {
            checkAdded();
        }
        updateMap();
    }
}

function checkAdded() {
    var target = document.querySelector(".GameMoreButton a");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            observer.disconnect();
            load();
        });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
}

function loadAllGames() {
    changeIcon(false);
    var addButton = document.querySelector(".GameMoreButton a");
    if(addButton != null) {
        addButton.onclick = function() {};
        showMore();
    }
}

function showMore() {
    document.querySelector(".GameMoreButton a").click();
    var target = document.querySelector(".GameMoreButton a");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            observer.disconnect();
            if(document.querySelector(".GameMoreButton a") == undefined) {
                updateMap();
            } else {
                showMore();
            }
        });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
}

function updateMap() {
    map = {};
    var games = document.querySelectorAll(".GameItemWrap");
    for(var i = 0; i < games.length; i++) {
        var summoners = games[i].querySelectorAll(".SummonerName");
        for(var j = 0; j < summoners.length; j++) {
            var str = summoners[j].innerText;
            if(str != user) {
                if(map[str] != undefined) {
                    map[str].push(i);
                } else {
                    map[str] = [];
                    map[str].push(i);
                }
            }
        }
    }
    changeIcon(true);
    console.log(Object.keys(map));
}

function createListItem(name) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("class", "Link");
    a.style.cursor = "pointer";
    li.setAttribute("class", "Item show");
    li.appendChild(a);
    a.innerHTML = name;
    return li;
}

function addToList(name, first) {
    var listItem = createListItem(name);
    if(first) {
        listItem.onclick = function() {
            showList(false);
            showAll();
        }
    } else {
        listItem.onclick = function() {
            showList(false);
            filter(this.innerText);
        }
    }
    search.querySelector(".All .ChampionList").appendChild(listItem);
}

function clearList() {
    var list = search.querySelector(".All .ChampionList");
    for(var i = list.children.length - 1; i > 1; i--) {
        list.children[i].remove();
    }
}

function addRecents() {
    var recents = document.querySelectorAll(".left_select_played_with_summoner");
    for(var i = 0; i < recents.length; i++) {
        var listItem = createListItem(recents[i].innerText);
        listItem.onclick = function() {
            filter(this.innerText);
            showList(false);
        }
        search.querySelector(".Recent .ChampionList").appendChild(listItem);
    }
}

var prev = [];
function resetText() {
    var games = document.querySelectorAll(".GameItemWrap");
    for(var i = 0; i < prev.length; i++) {
        console.log(prev.length)
        var names = games[prev[i]].querySelectorAll(".SummonerName a");
        for(var j = 0; j < names.length; j++) {
            if(names[j].innerText != user) {
                names[j].style.color = "inherit";
            }
        }
    }
}
function filter(name) {
    var games = document.querySelectorAll(".GameItemWrap");
    var show = map[name];

    resetText();

    for(var i = 0; i < games.length; i++) {
        games[i].style.display = "none";
    }

    for(var i = 0; i < show.length; i++) {
        games[show[i]].style.display = "block";
        var names = games[show[i]].querySelectorAll(".SummonerName a");
        for(var j = 0; j < names.length; j++) {
            if(names[j].innerText == name) {
                names[j].style.color = "black";
            }
        }
    }

    prev = show;
}

function showAll() {
    var games = document.querySelectorAll(".GameItemWrap");

    resetText();

    for(var i = 0; i < games.length; i++) {
        games[i].style.display = "block";
    }
}

function searchList(query) {
    var all = Object.keys(map);
    var matches = [];

    clearList();

    if(query.length != 0) {
        for(var i = 0; i < all.length; i++) {
            if(all[i].substring(0, query.length).toLowerCase() == query.toLowerCase()) {
                matches.push(all[i]);
            }
        }

        for(var i = 0; i < matches.length; i++) {
            addToList(matches[i], false);
        }
    }
}

function changeIcon(ready) {
    if(ready) {
        icon.setAttribute("class", "far fa-check-circle fa-2x");
        icon.style.color = "green";
    } else {
        icon.setAttribute("class", "far fa-times-circle fa-2x");
        icon.style.color = "red";
    }
}

function showList(show) {
    if(show) {
        search.querySelector(".Content").style.display = "block";
        champion.querySelector(".Content").style.display = "none";
    } else {
        search.querySelector(".Content").style.display = "none";
    }
}

function addElements() {
    link.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    document.querySelector("head").appendChild(link);

    button.setAttribute("class", "Button SemiRound White");
    button.textContent = "Load All Games";
    button.addEventListener("click", loadAllGames);
    document.querySelector(".Buttons").appendChild(button);

    search.querySelector("script").remove();
    search.querySelector(".Header").removeAttribute("id");
    search.querySelector("input").setAttribute("placeholder", "Search a Summoner");
    listRecent.querySelectorAll("li").forEach(function(el) {
        el.remove();
    })
    listAll.querySelectorAll("li").forEach(function(el) {
        el.remove();
    })
    search.querySelector(".Input").addEventListener("input", function() {
        searchList(search.querySelector(".Input").value)
    })
    search.querySelector(".Input").onclick = function() {
        showList(true);
    }
    document.addEventListener('click', function(event) {
        if(!search.contains(event.target)) {
            showList(false);
        }
    });

    document.querySelector(".Navigation .Actions").appendChild(search);

    iconWrapper.setAttribute("class", "Action");
    icon.style.margin = "5px";
    iconWrapper.appendChild(icon);
    document.querySelector(".Navigation .Actions").appendChild(iconWrapper);

    document.querySelectorAll(".Navigation .Actions .Action").forEach(function(el) {
        el.style.float = "right";
    })

    addRecents();
    addToList("Show All Summoners", true);
}
