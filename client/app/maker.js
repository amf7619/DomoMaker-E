const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($('#domoName').val() == '' || $('#domoAge').val() == '' || $('#domoHeight').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }

    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
        loadDomosFromServer();
    });

    return false;
}

const handleRemove = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);
    
    var selectedDomos = $('#removeDomos input[type=checkbox]:checked');
    if(selectedDomos.length === 0) {
        handleError('RAWR! You must select domos to remove');
        return false;
    }

    sendAjax('POST', $('#domoRemoveForm').attr('action'), selectedDomos, function() {
        loadDomosFromServer();
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={handleDomo}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'>
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name'/>
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='text' name='age' placeholder='Domo Age'/>
            <label htmlFor='height'>Height: </label>
            <input id='domoHeight' type='text' name='height' placeholder='Domo Height'/>
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeDomoSubmit' type='submit' value='Make Domo'/>
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className='domo'>
                <input className='domoSelect' type='checkbox' name='select' />
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoHeight'> Height: {domo.height}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector('#domos')
        );
    });
};

const DomoRemove = () => {
    return (
        <form id='domoRemoveForm'
            onSubmit={handleRemove}
            name='domoRemoveForm'
            action='/remove'
            method='POST'>
                <input className='makeDomoSubmit' type='submit' value='Remove Domos'/>
            </form>
    );
}

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector('#domos')
    );

    ReactDOM.render(
        <DomoRemove />, document.querySelector('#removeDomos')
    );

    loadDomosFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});