let user_data = {};
let award_table_data = [];

const flag_button_color = "background: rgb(147, 217, 147)";

if (document.cookie != "")
    user_data = JSON.parse(document.cookie);

console.log(user_data)

function save_cookie() {
    const temp = JSON.stringify(user_data);
    console.log(temp)
    document.cookie = temp;
}

function copyboard_user_data() {
    navigator.clipboard.writeText(JSON.stringify(user_data));
}

function handover_user_data() {
    user_data = JSON.parse(document.getElementById("user_data").value);
    init_user_data();
    apply_table_from_user_data();
}

function apply_table_from_user_data() {
    for (let i = 0; i < award_table_data.length; i++) {
        for (let j = 0; j < max_len; j++) {
            let td = document.getElementById(`td_${award_table_data[i]["index"]}_${j}`);
            let flag_button = document.getElementById(`flag_button_${award_table_data[i]["index"]}_${j}`);
            if (flag_button == null)
                continue;
            flag_button.checked = user_data[`${award_table_data[i]["index"]}`][j];
            if (flag_button.checked) {
                td.style = flag_button_color;
            } else {
                td.style = "";
            }
        }
    }

}

function init_user_data() {
    for (let i = 0; i < award_table_data.length; i++) {
        if (!(`${award_table_data[i]["index"]}` in user_data)) {
            user_data[`${award_table_data[i]["index"]}`] = [];
            for (let j = 0; j < max_len; j++)
                user_data[`${award_table_data[i]["index"]}`].push(false);
        }
    }

    save_cookie();
}

max_len = 8
function add_to_tbody(i, v) {
    let tbody = document.getElementById("tbody");
    let tr = document.createElement("tr");
    let th = document.createElement("th");

    let contest_link = document.createElement("a");

    contest_link.href = v["url"];
    contest_link.innerText = v["name"];

    th.appendChild(contest_link);
    tr.appendChild(th);

    const count = v["award"].length;
    for (let i = 0; i < max_len - count; i++)
        v["award"].push(null);

    v["award"].forEach((e, j) => {
        let td = document.createElement("td");
        td.id = `td_${v["index"]}_${j}`
        if (e != null) {
            let div = document.createElement("div");

            div.className = "";

            let body_link_novel = document.createElement("a");
            body_link_novel.href = e["body_url"];
            body_link_novel.innerText = e["name"];

            let review_link_novel = document.createElement("a");
            review_link_novel.href = e["review_url"];
            review_link_novel.innerText = "選評";

            let flag_button = document.createElement("input");
            flag_button.type = "checkbox";
            flag_button.style = "transform: scale(1.5);"
            flag_button.id = `flag_button_${v["index"]}_${j}`
            flag_button.onclick = function (e2) {
                if (flag_button.checked) {
                    td.style = flag_button_color;
                } else {
                    td.style = "";
                }
                console.log(e, `${v["index"]}`, user_data[`${v["index"]}`]);
                user_data[`${v["index"]}`][j] = flag_button.checked;
                save_cookie();
                console.log(user_data)
            }

            div.appendChild(flag_button);
            div.appendChild(document.createTextNode("\u00a0"));
            div.appendChild(document.createTextNode("\u00a0"));
            div.appendChild(body_link_novel);
            div.appendChild(document.createTextNode("\u00a0"));
            div.appendChild(document.createTextNode("\u00a0"));
            div.appendChild(review_link_novel);

            td.appendChild(div);
        }

        tr.appendChild(td);
    });

    tbody.appendChild(tr);
}
document.addEventListener("DOMContentLoaded", async (event) => {
    award_table_data = await (await fetch("/data.json")).json();

    console.log(award_table_data)

    init_user_data();

    award_table_data.forEach((e, i) => {
        add_to_tbody(i, e);
    });

    apply_table_from_user_data();
});
