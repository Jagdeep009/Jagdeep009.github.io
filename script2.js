const url = "https://api.thenewsapi.com/v1/news/all?api_token=FQH1aooRQuloSDVsIzAyWi2GP9bqbVD43OZiMQ69&search=";

const remove = document.querySelector(".remove");
const body = document.querySelector("body");

AsideNews("india");

async function GetNews(query) {
    try {
        const response = await fetch(`${url}${query}`);
        const data = await response.json();
        console.log(data)
        return data.data;
    }catch (error){
        throw error;
    }   
}

async function AsideNews(query){
    const container = document.querySelector("#news-list")
    const AsideNode = document.querySelector('#template-news-aside');
    const slideNews = document.querySelectorAll('#slide-news');
    const leftNews = document.querySelectorAll('#news-left');
    let News;
    let count = 0;

    try {
        News = await GetNews(query);
    } catch (error) {
        console.error("Error getting news:", error);
        return;
    }

    News = [...News,...News,...News,...News];

    for(article of News) {
        if(!article.image_url || !article.title || !article.source) continue;

        if(count < slideNews.length) {
            slideNews[count].style.backgroundImage = `url(${article.image_url})`;
            slideNews[count].setAttribute("href",`${article.url}`)
            slideNews[count].querySelector(".source").innerText = `${article.source}`;
            slideNews[count].querySelector(".news-heading").innerText = `${article.title.slice(0,60)+"..."}`
            count++;
        }
        else if(count == slideNews.length) {
            const heroNews = document.querySelector(".hero-slider");
            const head = heroNews.querySelector(".main-news-heading");
            const sourceMain = heroNews.querySelector("#main-source");
            const headImg = heroNews.querySelector(".hero-img");
            const headBtn = heroNews.querySelector(".hero-btn");

            head.innerText = `${article.title}`;
            sourceMain.innerHTML = `${"#"+article.source}`;
            headBtn.setAttribute("href",`${article.url}`)
            headImg.setAttribute("src",`${article.image_url}`);
            count++;
        } 
        else if(count < leftNews.length+3) {
            leftNews[count-3].setAttribute("href",`${article.url}`)
            const head = leftNews[count-3].querySelector(".news-title");
            const sourceMain = leftNews[count-3].querySelector(".category");
            const desc = leftNews[count-3].querySelector(".news-desc");

            head.innerText = `${article.title}`;
            desc.innerText = `${article.description}`;
            sourceMain.innerHTML = `${"#"+article.source}`;
            count++;
        }
        else {
            const cloneNode = AsideNode.content.cloneNode(true);
            FillAsideNews(cloneNode,article);
            container.appendChild(cloneNode);
        }
    }

    remove.classList.add("d-none");
    body.classList.remove("overflow-hidden");
}

function FillAsideNews(cloneNode,article) {
    const NewsDiv= cloneNode.querySelector(".news");
    const heading = cloneNode.querySelector(".news-heading");
    const category = cloneNode.querySelector(".category");
    const image = cloneNode.querySelector("#news-image");

    NewsDiv.setAttribute("href",`${article.url}`);
    heading.innerText = article.title;
    category.innerText = article.source.slice(0,20);
    image.setAttribute("src",`${article.image_url}`)
}

document.addEventListener('DOMContentLoaded', () => {
    const serachArticle = document.querySelector("#search-text");
    serachArticle.value = "";

    serachArticle.addEventListener('keypress', async (key) =>{
        if(serachArticle.value != "" && key.code=="Enter") {
            await AsideNews(serachArticle.value);
            serachArticle.value = ""
         }
    });
    
    document.querySelector("#search-article").addEventListener('click', async () => {
        if(serachArticle.value != "") {
           await AsideNews(serachArticle.value);
           serachArticle.value = ""
        }
    });
    
    document.querySelectorAll("#nav-item").forEach((n)=>{
        n.addEventListener('click',async function (){
            console.log("yes")
            await AsideNews(n.innerText);
        })
    });
    
    document.querySelector(".scroll-to-top").addEventListener("click",()=>{
        window.scrollTo({top : 0, behaviour: "smooth" })
    });
    
    document.querySelector(".btm-search").addEventListener("click",()=>{
        serachArticle.focus();
        window.scrollTo({top : 0, behaviour: "smooth" });
    
    });

    window.addEventListener("scroll",()=>{
        const scrollToTopButton = document.querySelector(".scroll-to-top");
        const btmSearch = document.querySelector(".btm-search");
        if (window.scrollY > 200) {
            scrollToTopButton.style.opacity = "1";
            btmSearch.style.opacity = "1";
        } else {
            scrollToTopButton.style.opacity = "0";
            btmSearch.style.opacity = "0";
        }
    });
});



