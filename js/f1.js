{
  {
    let form = document.getElementById('f1Standings');
    async function submitHandler(e){
        e.preventDefault();
        let season = e.target.season.value;
        let round = e.target.round.value;
        let standings = await getStandingsInfo(season, round);

        buildStands(standings);
        e.target.season.value = '';
        e.target.round.value = '';
    }
    form.addEventListener('submit', submitHandler);
  }

  async function getStandingsInfo(season, round){
    try{ 
      
        let res = await fetch(`http://ergast.com/api/f1/${season}/${round}/driverStandings.json`)
        let data = await res.json()
        return data
    }catch(err){
        console.error(err)
    }
  };

  async function buildStands(standings){
    let data = standings.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    console.dir(data);
    let seasonInfo = document.getElementById("seasonInfo");
    seasonInfo.innerHTML = `Season: ${standings.MRData.StandingsTable.StandingsLists[0].season}
                            & Round ${standings.MRData.StandingsTable.StandingsLists[0].round}`;

    for(let i=0; i<4; i++){
    const card = document.createElement('div');
    card.className = 'card mt-3';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body'

    const image = document.createElement('img');
    image.className = 'card-img-top';
    image.src = await getCountryInfo(data[i].Driver.nationality);
    card.append(image);

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.innerHTML = `${data[i].Driver.givenName} ${data[i].Driver.familyName}`;
    cardBody.append(title);

    const score = document.createElement('h6');
    score.className = 'card-subtitle mb-2 text-muted';
    score.innerHTML = `Rank: ${data[i].position} <br> Points: ${data[i].points}`;
    cardBody.append(score);
    
    const text = document.createElement('p');
    text.className = 'card-text';
    text.innerHTML = `Constructor: ${data[i].Constructors[0].name} <br>
                      Nationality: ${data[i].Driver.nationality}`;
    cardBody.append(text);

    card.append(cardBody);

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-3'
    col.append(card)

    const display = document.getElementById('standingTable');
    display.append(col);
    }

    async function getCountryInfo(countryName){
      try{
          let res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`)
          let data = await res.json()
          return data[0].flags.png;
      } catch(err) {
          console.error(err)
      }
  }

  }

}