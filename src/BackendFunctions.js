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

//Borrow a book via the robot (creates a transaction record)
export async function borrowBookWithRobot(libraryId, bookId, category) {
    try {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(returnDate.getDate() + 14); // 2-week loan period

        const borrowRequest = {
            libraryId: parseInt(libraryId),
            bookId: parseInt(bookId),
            borrowDate: today.toISOString().split('T')[0],
            returnDate: returnDate.toISOString().split('T')[0],
            category: category || "Standard",
            status: "Borrowed",
            borrowedThrough: "Robot"
        };

        const response = await fetch(`https://librioo-backend-production.up.railway.app/api/borrowrobot`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(borrowRequest)
        });

        if (response.ok) {
            return await response.json();
        } else if (response.status === 403) {
            return { error: "NOT_ELIGIBLE", message: "Not eligible to borrow (loan limit reached or overdue books)" };
        } else {
            return { error: "SERVER_ERROR", message: "Server error: " + response.status };
        }
    } catch (e) {
        console.error("Borrow API error:", e);
        return { error: "NETWORK_ERROR", message: e.toString() };
    }
}