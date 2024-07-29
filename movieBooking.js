const BASE_URL = "https://crudcrud.com/api/06165927720c4ef78c4e49aec5ed2853/movieBooking/";

document.addEventListener('DOMContentLoaded', () => {
    getBookingCount();
});

function getBookingCount(){
    axios
        .get(BASE_URL)
        .then(response => {
            document.getElementById("bookingCount").innerHTML = response.data.length;

            const bookingList = document.querySelector("ul");
            bookingList.innerHTML = "";
            bookingList.style.fontWeight = "bold";
            
            if (response.data.length) {
                response.data.forEach((user) => {
                    createBookingItem(user);
                })
            } else 
                bookingList.innerHTML = "Nothing Present"; 
        })
        .catch(error => console.log(error))
}

document.getElementById("findSlot").addEventListener('keyup', (event) => {
    if (event.target.value) {
        const selectedSeatNo = event.target.value;

        const bookingList = document.querySelector("ul");
        bookingList.innerHTML = "";

        axios
            .get(BASE_URL)
            .then(response => {
                const user = response.data.find(user => user.seatNo == selectedSeatNo);

                if (user) {
                    createBookingItem(user)
                } else {
                    bookingList.innerHTML = "Nothing Present";
                }
            })
            .catch(error => console.log(error))
    } else
        getBookingCount();
})

function handleFormSubmit(event) {
    event.preventDefault();

    axios
        .get(BASE_URL)
        .then(response => {
            const user = response.data.find(user => user.seatNo == event.target.seatnumber.value);

            if (user)
                alert("ALREADY BOOKED");
            else {
                const bookingDetails = {
                    userName: event.target.username.value,
                    seatNo: event.target.seatnumber.value,
                };
            
                axios
                    .post(
                        BASE_URL,
                        bookingDetails
                    )
                    .then((response) => {
                        var bookingCount = parseInt(document.getElementById("bookingCount").innerHTML);
                        bookingCount++;

                        document.getElementById("bookingCount").innerHTML = bookingCount;

                        const bookingList = document.querySelector("ul");

                        if (bookingCount == 1)
                            bookingList.innerHTML = "";

                        createBookingItem(response.data);
                    })
                    .catch((error) => console.log(error));
            
                document.getElementById("username").value = "";
                document.getElementById("seatnumber").value = "";
            }
        })
}
function createBookingItem(bookingDetails) {
    const bookingList = document.querySelector("ul");
    bookingList.style.fontWeight = "bold";

    const bookingItem = document.createElement("li");
    bookingItem.appendChild(
        document.createTextNode(
            `${bookingDetails.userName} ${bookingDetails.seatNo}`
        )
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("Delete"));

    deleteBtn.addEventListener("click", event => {
        bookingList.removeChild(event.target.parentElement);

        var bookingCount = parseInt(document.getElementById("bookingCount").innerHTML);
        bookingCount--;

        document.getElementById("bookingCount").innerHTML = bookingCount;

        if (bookingCount == 0)
            bookingList.innerHTML = "Nothing Present";
        axios.delete(BASE_URL + bookingDetails._id)
    })
    bookingItem.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.appendChild(document.createTextNode("Edit"));

    editBtn.addEventListener("click", function (event) {
        bookingList.removeChild(event.target.parentElement);
        
        document.getElementById("username").value = bookingDetails.userName;
        document.getElementById("seatnumber").value = bookingDetails.seatNo;

        var bookingCount = parseInt(document.getElementById("bookingCount").innerHTML);
        bookingCount--;

        if (bookingCount == 0)
            bookingList.innerHTML = "Nothing Present";
        document.getElementById("bookingCount").innerHTML = bookingCount;
        axios.delete(BASE_URL + bookingDetails._id)
    });
    bookingItem.appendChild(editBtn);

    bookingItem.style.fontWeight = "bold";
    bookingList.appendChild(bookingItem);
}