

export function Slider(selector, initialSlide = 0){
    this.slider = document.querySelector(selector);
    this.slider.classList.add("flex", "items-center", "relative");
    this.slider.setAttribute('tabindex', '0');
    this.slides = Array.from(this.slider.children);
    this.arrowStyle = "text-2xl bg-brand-main flex items-center justify-center rounded-full w-10 h-10";
    this.dotWrapperStyle = "absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 list-none";
    this.dotStyle = "w-3 h-3 rounded-full bg-green-500 text-transparent cursor-pointer";
    this.currentSlide = initialSlide;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;
    this.initialize();
    this.checkBoxType = "checkbox"
}

    Slider.prototype.changeSlide = function(){
        this.slides.forEach((slide, index) => {
        slide.classList.add("hidden");
        this.changeActiveDot(false, index)
        if(index === this.currentSlide){
        slide.classList.remove("hidden");
        this.changeActiveDot(true,index);
            }
        });
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = setInterval(this.nextSlide.bind(this), this.autoPlayDelay);
    };

    Slider.prototype.changeActiveDot = function(isActive, index){
        if(isActive){
            this.slider.querySelector(`#dot-${index}`).classList.add("bg-blue-500");
            this.slider.querySelector(`#dot-${index}`).classList.remove("bg-green-500");
        } else{
           this.slider.querySelector(`#dot-${index}`).classList.remove("bg-blue-500");
           this.slider.querySelector(`#dot-${index}`).classList.add("bg-green-500");
        }
    };
   
    Slider.prototype.nextSlide = function(){
        if(this.currentSlide === this.slides.length - 1 ){
                    this.currentSlide = 0;
                } else { 
                    this.currentSlide++;
                }

                this.changeSlide();
    };
    Slider.prototype.prevSlide = function(){
        if(this.currentSlide === 0){
            this.currentSlide = this.slides.length - 1;
        } else { 
            this.currentSlide--;
        }
        this.changeSlide();
    }

   Slider.prototype.createArrow = function(){
        const prevArrow = document.createElement("button");
        prevArrow.innerText = "<";
        prevArrow.className = this.arrowStyle;
        prevArrow.classList.add("-order-1")
        prevArrow.addEventListener("click", this.prevSlide.bind(this));
        const nextArrow = document.createElement("button");
        nextArrow.innerText = ">";
        nextArrow.className = this.arrowStyle;
        nextArrow.addEventListener("click", this.nextSlide.bind(this));
        this.slider.appendChild(prevArrow);
        this.slider.appendChild(nextArrow);
        return (prevArrow, nextArrow);
   };
   Slider.prototype.createDots = function(){
        const dotsWrapper = document.createElement("ul");
        dotsWrapper.className = this.dotWrapperStyle;
        dotsWrapper.id = "dotsWrapper";
        this.slides.forEach((_, index) =>{
            const dotWrap = document.createElement("li");
            const dot = document.createElement("button");
            dot.id = `dot-${index}`;
            dot.className = this.dotStyle;
            dot.innerText = index + 1;
            if(index === this.currentSlide){
                   dot.classList.add("bg-blue-500");
            }
            dot.addEventListener("click", () => {
                this.currentSlide = index;
                this.changeSlide();
            });

            dotWrap.appendChild(dot);
            dotsWrapper.appendChild(dotWrap);
        });
        this.slider.appendChild(dotsWrapper);
   };

   Slider.prototype.options = function(){
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
   checkbox.addEventListener("change", () =>{
        if(checkbox.checked === true){
            this.slider.querySelector("#dotsWrapper").classList.add("hidden");
        }
        if(checkbox.checked === false){
            this.slider.querySelector("#dotsWrapper").classList.remove("hidden");
        }
   });
   
   this.slider.appendChild(checkbox);
   }
    
   Slider.prototype.setPlayInterval = function(){
     const intervalInput = document.createElement("input");
     intervalInput.setAttribute("type", "number");
     intervalInput.setAttribute("min", "1");
     const intervalButton = document.createElement("button");
     intervalButton.innerText = "Змінити інтервал"
     
     intervalButton.addEventListener("click", () =>{
        clearInterval(this.autoPlayInterval);
        const seconds = Number(intervalInput.value);
        this.autoPlayDelay = Number(intervalInput.value) * 1000; 
        this.autoPlayInterval = setInterval(this.nextSlide.bind(this), seconds * 1000);
        console.log(this.autoPlayDelay);
     })
         this.slider.appendChild(intervalInput);
        this.slider.appendChild(intervalButton);

   }

   export function touchSlider(selector, initialSlide = 0){
        Slider.call(this, selector, initialSlide);
        this.startX = 0;
        this.isDragging = false;
        this.init();
   }
   touchSlider.prototype = Object.create(Slider.prototype);
   touchSlider.prototype.constructor = touchSlider;
   touchSlider.prototype.init = function(){
    this.slider.addEventListener('touchstart', e => {
        this.startX = e.touches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - this.startX;
        if (Math.abs(dx) > 50) dx < 0 ? this.nextSlide() : this.prevSlide();
    });

    this.slider.addEventListener('mousedown', e => {
        this.isDragging = true;
        this.startX = e.clientX;
        this.slider.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', e => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.slider.style.cursor = '';
        const dx = e.clientX - this.startX;
        if (Math.abs(dx) > 50) dx < 0 ? this.nextSlide() : this.prevSlide();
    });
   }

   Slider.prototype.initialize = function(){
        this.createArrow();
        this.createDots();
        this.changeSlide();
        this.options();
        this.setPlayInterval();
        this.slider.addEventListener("mouseenter", () => clearInterval(this.autoPlayInterval));
        this.slider.addEventListener("mouseleave", () =>{

        clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = setInterval(this.nextSlide.bind(this), this.autoPlayDelay);
        });
        this.slider.addEventListener('keydown', (event) =>{
            if(event.key === "ArrowRight"){
                this.nextSlide();
            } else if (event.key === "ArrowLeft"){
                this.prevSlide();
            }
            console.log(event);
        });
   }


   


