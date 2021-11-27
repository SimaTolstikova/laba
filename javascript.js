const data = (new function () {

    let id_of_student = 1;
    const array = {};

    this.create = obj => {
        obj.Id = id_of_student++;
        array[obj.Id] = obj;
        return obj;
    }

    this.getAll = () => {
        return Object.values(array);
    }

    this.get = id => array[id];

    this.update = obj => {
        array[obj.Id] = obj;
        return obj;
    }

    this.delete = id => {
        delete array[id];
    }
});

for (let num = 1; num < 4; num++) {
    data.create({
        name: "Студент " + num
        , birthday: "2002-10-2" + num
        , course: "1"
        , group: "ЦПИ-11"
        , phone: "8(999)999-99-0" + num
        ,
    });
}

const util = new function () {

    this.parse = (tpl, obj) => {
        let str = tpl;
        for (let k in obj) {
            str = str.replaceAll("{" + k + "}", obj[k]);
        }
        return str;
    };

    this.id = el => document.getElementById(el);
    this.q = el => document.querySelectorAll(el);
    this.listen = (el, type, callback) => el.addEventListener(type, callback);
}

const student = new function () {

	this.submit = () => {

		const st = {
            name: util.id("name").value,
			birthday: util.id("birthday").value,
			course: util.id("course").value,
            group: util.id("group").value,
            phone: util.id("phone").value,
        };


        if(util.id("Id").value == "0"){
            data.create(st)
        }
        else {
            st.Id = util.id("Id").value;
            data.update(st);
        }

    }

    this.remove = () => {
        data.delete(activeStudent);
        this.render();
        activeStudent = null;
        util.id("fieldset_deletion").style.display = "none";
    }

    const init = ()=>{
        this.render();

        util.q("#to_close_fieldset_deletion, #kr_to_close_fieldset_deletion").forEach(el=>{
            util.listen(el, "click", ()=>{
                util.id("fieldset_deletion").style.display = "none";
            });
        });

        util.q("#kr_to_close_fieldset_creation").forEach(el=>{
            util.listen(el, "click", ()=>{
                util.id("fieldset_creation").style.display = "none";
             });
        });

        util.id("delete_student").addEventListener("click", student.remove)
        util.id("submit").addEventListener("click", student.submit)
    };

    const add = () => {
        util.q("#fieldset_creation .modal-title")[0].innerHTML = "Добавить сведения о новом студенте";
        util.q("#form_creation")[0].reset();
        util.id("Id").value = "0";
        util.id("fieldset_creation").style.display = "block";
    };

    const edit = el => {
        util.q("#fieldset_creation .modal-title")[0].innerHTML = "Изменить сведения о студенте";
        util.q("#form_creation")[0].reset();

        const st = data.get(el.dataset["id"]);
        for(let k in st){
            util.id(k).value = st[k];
        }
        util.id("fieldset_creation").style.display = "block";
    };

    let activeStudent = null;
    const rm = el => {
        util.id("fieldset_deletion").style.display = "block";
        activeStudent = el.dataset["id"];
    };

    const listeners = {
        edit: [],
        rm: []
    };

    const clearListener = ()=>{
        listeners.edit.forEach(el=>{
            el.removeEventListener("click",edit);
        });
        listeners.rm.forEach(el=>{
            el.removeEventListener("click",rm);
        });
        listeners.edit = [];
        listeners.rm = [];
    };

    const addListener = ()=>{
        util.id("to_view_form_add").addEventListener("click", add);

        util.q(".to_view_form_edit").forEach(el=>{
            listeners.edit.push(el);
            util.listen(el, "click", ()=>edit(el));
        });
        util.q(".to_view_form_remove").forEach(el=>{
            listeners.rm.push(el);
            util.listen(el, "click", ()=>rm(el));
        });
    };

    this.render = () => {
        clearListener()
        util.id("main_table").innerHTML = data
            .getAll()
            .map(el => util.parse(tpl, el)).join("");
        addListener();
    };

    const tpl = `
        <tr>
            <td>{Id}</td>
            <td>{name}</td>
            <td>{birthday}</td>
            <td>{course}</td>
            <td>{group}</td>
            <td>{phone}</td>
            <td>
                <button class="to_view_form_edit" data-id="{Id}" type="button">Изменить</button>
                <button class="to_view_form_remove" data-id="{Id}" type="button">Удалить</button>
            </td>
        </tr>
    `;
    window.addEventListener("load",init);
}


