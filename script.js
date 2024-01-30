let resourceArr=[]
let blogcount=0
let blogdiv=document.getElementById("blog-space")
let h2=document.getElementById("counter")
let Gid="",updatingUser=false

window.addEventListener("DOMContentLoaded",async ()=>{
    let bloglist = await axios.get(`https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog`).then((res)=>res.data)
    for(let i=0;i<bloglist.length;i++){

        let newDiv = document.createElement("div");
        newDiv.classList.add("container","border","m-5","blog-card");
        newDiv.innerHTML =
          `<div style="display:none;">${bloglist[i]["_id"]}</div><h3>${bloglist[i]["BlogTitle"]}</h3><img class="img-thumbnail" src="${bloglist[i]["image"]}"><p>${bloglist[i]["Description"]}<p>` +
          '&nbsp&nbsp<div class="btn-group text-right"><button  class=" delete-btn btn btn-danger" type="button" ">Delete Blog</button>' +
          '<button  class="edit-btn btn btn-primary" type="button" ">Edit Blog</button></div>';
        newDiv.setAttribute("onclick", "deleter(event);editer(event);");
        console.log(newDiv)
        blogdiv.appendChild(newDiv);

        blogcount++
        h2.innerHTML=`Blog Count ${blogcount}`

    }
})


async function postFormData(event){
    event.preventDefault()
    console.log(event.target[0].value)

    let imgURL=event.target[0].value
    let BlogTitle=event.target[1].value
    let Description=event.target[2].value

    console.log(imgURL,BlogTitle,Description)

    let data=JSON.stringify({
        image: imgURL,
        BlogTitle: BlogTitle,
        Description: Description
    })

    if(updatingUser){
        console.log("inside updating user",Gid)
        updatingUser=false

    
        let config={
            method: "put",
            url: "https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog/"+Gid,
            headers: {
                "Content-Type": "application/json",
              },
            data: data,
        }
    
        await axios(config)
        .then(async (res)=>{
            console.log(res)
            console.log(resourceArr)
            let tempCard=document.querySelector("#inEditingMode")
            console.log(tempCard,"||",resourceArr)
            let blogDetails = await axios.get(`https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog/${Gid}`)


            // newDiv.classList.add("container","border","m-5","blog-card");
            tempCard.innerHTML =
              `<div style="display:none;">${blogDetails.data._id}</div><h3>${blogDetails.data.BlogTitle}</h3><img class="img-thumbnail" src="${blogDetails.data.image}"><p>${blogDetails.data.Description}<p>` +
              '&nbsp&nbsp<div class="btn-group text-right"><button  class=" delete-btn btn btn-danger" type="button" ">Delete Blog</button>' +
              '<button  class="edit-btn btn btn-primary" type="button" ">Edit Blog</button></div>';
              tempCard.setAttribute("onclick", "deleter(event);editer(event);");
            console.log(tempCard)
            tempCard.removeAttribute("id")

        })
        .catch((err)=>console.log(err))
        let cards=document.getElementsByClassName("blog-card")
        console.log(cards)
    }else{

        let config={
            method: "post",
            url: "https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog",
            headers: {
                "Content-Type": "application/json",
              },
            data: data,
        }
    
        await axios(config)
        .then((res)=>{
    
            resourceArr=res.data
            console.log(resourceArr)
        })
        .catch((err)=>console.log(err))

        let newDiv = document.createElement("div");
        newDiv.classList.add("container","border","m-5","blog-card");
        newDiv.innerHTML =
          `<div style="display:none;">${resourceArr["_id"]}</div><h3>${resourceArr["BlogTitle"]}</h3><img class="img-thumbnail" src="${resourceArr["image"]}"><p>${resourceArr["Description"]}<p>` +
          '&nbsp&nbsp<div class="btn-group text-right"><button  class=" delete-btn btn btn-danger" type="button" ">Delete Blog</button>' +
          '<button  class="edit-btn btn btn-primary" type="button" ">Edit Blog</button></div>';
        newDiv.setAttribute("onclick", "deleter(event);editer(event);");
        console.log(newDiv)
        blogdiv.appendChild(newDiv);

        blogcount++
        h2.innerHTML=`Blog Count ${blogcount}`
    }

}

async function deleter(event){
    event.preventDefault();
    if (event.target.classList.contains("delete-btn")) {
      const usrDetails = event.target.parentElement.parentElement;
      const id =
        event.target.parentElement.parentElement.firstElementChild.textContent;
      console.log("|", usrDetails, id);
      await axios.delete("https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog/"+id)
      blogdiv.removeChild(usrDetails);
      blogcount--
      h2.innerHTML=`Blog Count ${blogcount}`

    }
}

async function editer(event){
    event.preventDefault();
    updatingUser=true
    if (event.target.classList.contains("edit-btn")) {
      const usrDetails = event.target.parentElement.parentElement;

      console.log(usrDetails);
      usrDetails.id="inEditingMode"
      const id =
        event.target.parentElement.parentElement.firstElementChild.textContent;
        Gid=id
        console.log(Gid)
      let blogDetails = await axios.get(`https://crudcrud.com/api/c483469fc4cc4d61a018d933992755c0/blog/${Gid}`)
  
      document.getElementById("imgURL").value = blogDetails.data.image;
      document.getElementById("Blog-Title").value = blogDetails.data.BlogTitle;
      document.getElementById("Blog-Desc").value = blogDetails.data.Description;
    }
}