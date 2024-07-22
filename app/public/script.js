const input = document.querySelector('input[name=price]')
const events = ['keydown','keyup','keypress']
events.forEach(event=> {
    input.addEventListener(event,event=> {
          
            let formatValue = parseInt(event.target.value.replace(/\D/g,'')) / 100 
            if(!formatValue) {
                event.target.value = "";
                return
            }
            formatValue = Intl.NumberFormat('pt-BR',{
                style:'currency',
                currency:'BRL'
            }).format(formatValue)
            
            event.target.value = formatValue
    })
})

document.addEventListener('DOMContentLoaded',() => {
    if(input.value){
        let formatValue = parseInt(input.value.replace(/\D/g,'')) / 100 
        if(!formatValue) {
            input.value = "";
            return
        }
        formatValue = Intl.NumberFormat('pt-BR',{
            style:'currency',
            currency:'BRL'
        }).format(formatValue)

        input.value = formatValue
    }
})

const MAX_FILES = 6

class PhotoUpload {
    input = document.querySelector('input[type=file]')
    preview = document.querySelector('#photos-preview')
    inputFilesDelete = document.querySelector('#filesDelete')
    files = []
    dataTransfer = new DataTransfer()
    constructor() {
        this.addEvent()
    }

    addEvent(){
        const filesServe = document.querySelectorAll('.photo')
        this.input.addEventListener('change',this.showPhotos.bind(this))

        filesServe.forEach(fileElementPreview => fileElementPreview.addEventListener('click', this.removeItem.bind(this)))
    }

    async showPhotos(){
        const filesServe = document.querySelectorAll('.photo')
        const totalFilesServer = [...filesServe].reduce((countChild, currentElement) => {
            if(currentElement.id){
                return countChild + 1
            }

            return countChild
        },0)
        const files = [...this.input.files];
        const totalFiles = this.dataTransfer.files.length + files.length + totalFilesServer
        
        if(totalFiles > MAX_FILES || files.length > MAX_FILES) {
            return this.input.files = this.dataTransfer.files
        }
        

        await Promise.all(files.map(async file => await this.renderPreview(file)))
        this.addFiles(files)
        
       
    }

    addFiles(files = []){

        for (let index = 0; index < files.length; index++) {
            const currentFile = files[index]
            this.dataTransfer.items.add(currentFile)
            
        }
        this.input.files = this.dataTransfer.files
    }

    async renderPreview(file) {
        const container = document.createElement('div')
        container.classList.add('photo')

        const url = await this.renderPhoto(file)

        const img = new Image()

        const close = document.createElement('i')

        close.classList.add('material-symbols-outlined')

        img.src = url
        img.name = file.name
        close.textContent = "close"
        container.appendChild(img)
        container.appendChild(close)
        container.addEventListener('click',this.removeItem.bind(this))

        this.preview.appendChild(container)
    }

    addIdFileDelete(id){
        const values = this.inputFilesDelete.value;
        if(values){
          return this.inputFilesDelete.value = `${values},${id}`
        }
        
        return this.inputFilesDelete.value = `${id}`
    }
    removeItem(event){
        const target = event.currentTarget
        const img = target.querySelector('img')
        const name = img.name;
        

        if(target.id) {
            this.addIdFileDelete(target.id)
            return target.remove()
        }
        
        target.remove()
        const indexFile = Array.from(this.dataTransfer.files).findIndex(file=> file.name === name)
        this.dataTransfer.items.remove(indexFile)

        this.input.files = this.dataTransfer.files
        
    }
    async renderPhoto(file){

        return new Promise((resolve, reject) => {

            const fileReader = new FileReader()

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = () => {
                reject()
            }
            fileReader.readAsDataURL(file)
        })
    }
}




new PhotoUpload()
