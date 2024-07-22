class LightBox {
    galleryPriviewItem = document.querySelectorAll('.gallery-preview-item')
    highlight = document.querySelector('.highlight img')
    lightBoxTarget = document.querySelector('.lighbox-target')
    lightBoxClose = document.querySelector('.lightbox-close')
    lightBoxImg = document.querySelector('.containerImageLightBox img')
    constructor(){

        this.galleryPriviewItem.forEach(previewItem=> previewItem.addEventListener('click', this.changePhotoPreview.bind(this)))
        this.zoomImg()
    }
    resetActive(){
        this.galleryPriviewItem.forEach(previewItem=> previewItem.classList.remove('active'))
    }
    changePhotoPreview(event){
        
        this.resetActive()
        const target = event.target
        const src = target.src
        this.highlight.src = src
        this.lightBoxImg.src = src
        target.parentElement.classList.add('active')
    }

    zoomImg(){
        this.highlight.parentElement.addEventListener('click',this.showModalZoom.bind(this))
        this.lightBoxClose.addEventListener('click',this.closeModalZoom.bind(this))
    }

    showModalZoom(){
        this.lightBoxTarget.classList.toggle('active')
    }

    closeModalZoom(){
        this.lightBoxTarget.classList.toggle('active')
    }
}

new LightBox()