const parties = document.querySelectorAll('.partyContainer');


parties.forEach( (party) => {
  const {id} = party;  
  const del = party.querySelector('#del');
  const container = document.querySelector('.container');
  const join = party.querySelector('#join');

  

  del.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch(`/party/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partyId: id}),
    });
    container.removeChild(party);
  });

  join.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch(`/party/join/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partyId: id}),
    });
    const data = response.json()
    
  });
});