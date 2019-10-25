console.log('memelyfe');
const userId = window.location.pathname.split('/')[3];
console.log(userId);

//Home Page Nav Button
$('.go-home').on('click', () => {
    return window.location = `/profile/${userId}`
})

//Log Out Button
const logoutSuccess = () => {
    return window.location = `/`
}

const logoutError = () => {
    console.log('logout failed')
}

$('.logout').on('click', () => {
    $.ajax({
        method: 'DELETE',
        url: 'http://localhost:3000/api/v1/logout',
        credentials: 'include',
        success: logoutSuccess,
        error: logoutError,
    })
})

//Delete Meme on User Update
const deleteEntry = (res) => {
    console.log(`deleted meme --->${res.data}`)
}

const errDeleteEntry = () => {
    console.log('Something went wrong, the meme was not deleted.')
}

const deleteMeme = (memeId) => {
    console.log(memeId)
    $.ajax({
        method: 'DELETE',
        url: `/api/v1/memes/${memeId}`,
        success: deleteEntry,
        error: errDeleteEntry,
    })
}
//NOTE res.data refers to the User object, hoist memeId to global variable and update it on click
const updateUserSuccess = (res) => {
    console.log(`deleted user---->${res.data}`)
}

const updateError = () => {
    console.log('failed to update user')
}


updateUser = (memeId) => {
    $.ajax({
        method: 'PUT',
        url: `/api/v1/users/${userId}/${memeId}`,
        success: updateUserSuccess,
        error: updateError,
    })
}
//User Update before Deleting Meme
$('.cardSection').on('click', '.delete-btn', () => {
    let memeId = $(event.target).parent().parent().attr('id');
    console.log(memeId);
    updateUser(memeId);
    deleteMeme(memeId);
})

//Meme Posting to DOM
const onError = () => {
    console.log('error')
}

const postMemes = (res) => {
    console.log(res)
    const meme = res.data;
    $('.cardSection').prepend(`
    <div class="card" id="${meme._id}">
        <div class="card-header bg-transparent">
            <h2 class="memeTitle">${meme.title}</h2>
        </div>
        <div class="card-body">
                <img class="memeImg" src="${meme.link}">
        </div>
        <div class="card-footer bg-transparent">
            <input type="button" class="btn btn-primary delete-btn" value="Delete"/>
        </div>
    </div>
    `);
};

const onSuccess = (res) => {
    console.log(res.data.memes)
    res.data.memes.forEach((meme) => {
        $.ajax({
            method: 'GET',
            url: `http://localhost:3000/api/v1/memes/${meme}`,
            success: postMemes,
            error: onError,
        })
    })
}

const findMyMemes = () => { 
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/api/v1/users/profile/${userId}`,
        success: onSuccess,
        error: onError,
    })
}

findMyMemes(); 

