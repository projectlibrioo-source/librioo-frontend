export function testfun(libraryId){
    console.log(libraryId);


}

//Login for the members
export async function memberLogin(libraryId) {
    try{
        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/loginmember?libraryid=${libraryId}`, {
            method: "POST",
        });

        if(response.ok){
            const memberData = await response.json();
            //console.log(memberData);

            return memberData;


        }else{
            return null;
        }
    }catch(e){
        alert("Error occured "+e);
    }
}

//Search by book name
export async function searchBooksByName(keyword) {
    if (!keyword || keyword.trim() === "") return [];

    try {
        const response = await fetch(
            `https://librioo-backend-production.up.railway.app/api/searchname?keyword=${encodeURIComponent(keyword)}`
        );

        // if (!response.ok) {
        //   throw new Error("Failed to fetch books");
        // }

        return await response.json();
    } catch (error) {
        console.error("Search API error:", error);
        return [];
    }
}

//Search by category
export async function searchByCategory(category) {
    if (!category || category.trim() === "") return [];

    try{
        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/searchcategory?category=${encodeURIComponent(category)}`);

        return await response.json();

    }catch(e){
        return [];
    }
}

//Login for the guests
export async function guestLogin(guestid) {
    try{
        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/loginguest?guestid=${guestid}`, {
            method: "POST",
        });

        if(response.ok){
            const guestData = await response.json();
            return guestData;


        }else{
            return null;
        }
    }catch(e){
        alert("Error occured "+e);
    }
}

//Retrive categories from the database
export async function getCategories() {
    try{
        const response = await fetch("https://librioo-backend-production.up.railway.app/api/getcategory", {
            method:"GET"
        });

        if(response.ok){
            const categoryArray = await response.json();
            return categoryArray;

        }else{
            alert("Error fetching data");
        }

    }catch(e){
        alert(e);
    }
}

//Navigate by book name
export async function navigateByBookName(bookName) {
    try{
        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/navigate/book?name=${encodeURIComponent(bookName)}`, {
            method:"GET"
        });

    }catch(e){
        alert(e);
    }
}

//Navigate by category
export async function navigateByCategory(category) {
    try{
        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/navigate/category?category=${encodeURIComponent(category)}`, {
            method:"GET"
        });

        if (response.ok) {
            console.log("Category navigation sent: " + category);
            return true;
        } else {
            console.error("Failed to send category navigation");
            return false;
        }

    }catch(e){
        alert(e);
    }
}