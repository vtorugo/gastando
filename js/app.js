class Expense {
    constructor(year, month, day, category, description, amount) {
        this.year = year
        this.month = month
        this.day = day
        this.category = category
        this.description = description
        this.amount = amount
    }

    validateData() {

        for(let i in this) {

            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }       
        }
        return true
    }
}

class Database {

    constructor() { 
        let id = localStorage.getItem('id') 

        if(id === null) {
            localStorage.setItem('id', 0)
        } 
    }

    getNextId() {
        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1
    }

    storeData(d) {
        let id = this.getNextId()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    
    recoverAllRegistry() {

        let expenses = []

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {

            let expense = JSON.parse(localStorage.getItem(i))
    
            if(expense === null) {
                continue 
            }

            expense.id = i
            expenses.push(expense)
        }
        
        return expenses
    }

    search(expense) {
        let filteredExpenses = []
        filteredExpenses = this.recoverAllRegistry()

       
        console.log(expense)
        console.log(filteredExpenses)

        if(expense.ano != '') {
            filteredExpenses = filteredExpenses.filter(d => d.ano == expense.ano)
        }
        if(expense.mes != '') {
            filteredExpenses = filteredExpenses.filter(d => d.mes == expense.mes)
        }
        if(expense.dia != '') {
            filteredExpenses = filteredExpenses.filter(d => d.dia == expense.dia)
        }
        if(expense.categoria != '') {
            filteredExpenses = filteredExpenses.filter(d => d.categoria == expense.categoria)
        }
        if(expense.descricao != '') {
            filteredExpenses = filteredExpenses.filter(d => d.descricao == expense.descricao)
        }
        if(expense.valor != '') {
            filteredExpenses = filteredExpenses.filter(d => d.valor == expense.valor)
        }
        return filteredExpenses
    }

    removeData(id) { 
        localStorage.removeItem(id)      
    }
}

let db = new Database()

function registerExpense() {
    
    let year = document.getElementById('ano')
    let month = document.getElementById('mes')
    let day = document.getElementById('dia')
    let category = document.getElementById('categoria')
    let description = document.getElementById('descricao')
    let amount = document.getElementById('valor')

    let expense = new Expense(
        year.value, 
        month.value, 
        day.value, 
        category.value, 
        description.value, 
        amount.value
    )
    
    if(expense.validateData()) {

        db.storeData(expense)

        createPopup (   
            "modal-header text-success", 
            "Dados gravados com successo", 
            "Sua despesa foi registrada com sucesso!", 
            "btn btn-success", 
            "Ok"
        )

        document.getElementById('categoria').value = ''
        document.getElementById('descricao').value = ''
        document.getElementById('valor').value = ''

        $('#dialog-popup').modal('show')        

    } else {

        createPopup (   
            "modal-header text-danger", 
            "Erro na gravação", 
            "Existem campos obrigatórios que não foram preenchidos corretamente", 
            "btn btn-danger", 
            "Voltar e corrigir"
        )

        $('#dialog-popup').modal('show')
    }
}

function loadAllExpenses(expenses = [], filter = false) {

    if(expenses.length == 0 && filter == false) {
        expenses = db.recoverAllRegistry()

    }

    let expensesList = document.getElementById('expenses-list')
    expensesList.innerHTML = ''

    expenses.forEach(function(data) {
        
        let row = expensesList.insertRow()

        row.insertCell(0).innerHTML = `${data.day}/${data.month}/${data.year}`
        
        switch(data.category) {
            case '1': data.category = 'Alimentação'
                break
            case '2': data.category = 'Educação'
                break
            case '3': data.category = 'Lazer'
                break
            case '4': data.category = 'Saúde'
                break
            case '5': data.category = 'Transporte'
                break
        }

        row.insertCell(1).innerHTML = data.category
        row.insertCell(2).innerHTML = data.description
        row.insertCell(3).innerHTML = `R$ ${data.amount}`

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-minus"></i>'
        btn.id = `expense_id_${data.id}`
        console.log(btn.id)

        btn.onclick = function() {

            let id = this.id.replace('expense_id_', '')

            document.getElementById('modal-label').className = "modal-header text-danger"
            document.getElementById('modal-heading').innerHTML = "Atenção!"
            document.getElementById('modal-text').innerHTML = "Você tem certeza que quer excluir esta despesa?"
            document.getElementById('modal-dismiss').className = "btn btn-danger text-light"
            document.getElementById('modal-dismiss').innerHTML = "Excluir"
            document.getElementById('modal-dismiss').addEventListener("click", deleteExpense)
            
            function deleteExpense() {
                db.removeData(id);
                F5(); 
            }         

            $('#dialog-popup').modal('show')
        }

        row.insertCell(4).append(btn)

        console.log(data)
        
    })    
}

function pesquisarDespesa() {
    
    let year = document.getElementById('ano').value
    let month = document.getElementById('mes').value
    let day = document.getElementById('dia').value
    let category = document.getElementById('categoria').value
    let description = document.getElementById('descricao').value
    let amount = document.getElementById('valor').value

    let expense = new Expense(year, month, day, category, description, amount)
    
    let expenses = db.search(expense)

    loadAllExpenses(expenses, true)    
}

function createPopup(labelClass, labelText, innerText, buttonClass, buttonText, id) {

    document.getElementById('modal-label').className = labelClass
    document.getElementById('modal-heading').innerHTML = labelText
    document.getElementById('modal-text').innerHTML = innerText
    document.getElementById('modal-dismiss').className = buttonClass
    document.getElementById('modal-dismiss').innerHTML = buttonText;    
}

function F5() {
    window.location.reload()
}
