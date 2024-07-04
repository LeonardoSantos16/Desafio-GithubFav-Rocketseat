import { GithubUser } from "./GithubUser.js";

export class Favorites{
    constructor(app){
        this.app = document.querySelector(app)
        this.load()
    }
    
    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) ||  []
    }

    async create(username){
        try{
            const userExists = this.entries.find(entry => entry.login === username)
            if(userExists){
                throw new Error('Usuário já cadastrado')
            }
            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }catch(error){
            alert(error.message)
        }
    }
    delete(user){
        const entriesFilter = this.entries.filter(entry => entry.login !== user.login)
        this.entries = entriesFilter
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites{
    constructor(app){
        super(app)
        this.tbody = this.app.querySelector('table tbody')
        this.update()
        this.eventSearchEvent()
        
    }
    
    eventSearchEvent(){
        const addButton = this.app.querySelector('.search button')
        addButton.onclick = () =>{
            const { value } = this.app.querySelector('.search input')

            this.create(value)
        }
    }
    update(){
        this.removeAllLines()
        this.backgroundDefault()
        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const deleteLines = confirm('Deseja deletar essa linha?')
            
                if(deleteLines){
                    this.delete(user)
                }
            }
            this.tbody.append(row)            
        })
    }

    createRow(){
        // <tr> não pode ser criada em texto, apenas na DOM
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/LeonardoSantos16.png" alt="imagem de leonardo">
            <a href="https://github.com/LeonardoSantos16" target="_blank">
                <p>Leonardo Ferreira</p>
                <span>leodsmf</span>
            </a>
        </td>
        <td class="repositories">
            70
        </td>
        <td class="followers">
            1
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
               `       
        return tr      
    }

    backgroundDefault(){
        const element = document.querySelector('#default');
        if(this.entries.length == 0){
            element.style.display = 'flex'
        }else if(this.entries.length != 0){
            element.style.display = 'none'
        }
    }

    removeAllLines() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
}