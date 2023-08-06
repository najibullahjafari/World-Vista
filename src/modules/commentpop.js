const openPopup = async (countryDetails) => {
  // Create the popup container
  const popContainer = document.createElement('div');
  popContainer.classList.add('popup-container', 'card');

  const counteryDetail = document.createElement('div');
  counteryDetail.classList.add('countery-datail');

  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-times', 'popup-icon');

  const countryFlagEl = document.createElement('img');
  countryFlagEl.classList.add('country-flag');
  countryFlagEl.src = countryDetails.flags.png;

  const countryNameEl = document.createElement('h1');
  countryNameEl.classList.add('country-name');
  countryNameEl.textContent = countryDetails.name.common;

  const countryPopulationEl = document.createElement('div');
  countryPopulationEl.classList.add(
    'country-population',
    'container',
    'custom-container',
    'shadow-lg',
    'bg-gradient-success'
  );
  countryPopulationEl.textContent = `Population: ${countryDetails.population}`;

  const countryCapitalEl = document.createElement('div');
  countryCapitalEl.classList.add(
    'country-capital',
    'container',
    'custom-container',
    'shadow-lg',
    'bg-gradient-success'
  );
  countryCapitalEl.textContent = `Capital: ${countryDetails.capital}`;

  const countryAreaEl = document.createElement('div');
  countryAreaEl.classList.add(
    'country-area',
    'container',
    'custom-container',
    'shadow-lg',
    'bg-gradient-success'
  );
  countryAreaEl.textContent = `Area: ${countryDetails.area} km²`;

  const countryContinentEl = document.createElement('div');
  countryContinentEl.classList.add(
    'country-continent',
    'container',
    'custom-container',
    'shadow-lg',
    'bg-gradient-success'
  );
  countryContinentEl.textContent = `Continent: ${countryDetails.region}`;

  const commentsContainer = document.createElement('div');
  commentsContainer.classList.add('comments-container');

  const commentsCounter = document.createElement('div');
  commentsCounter.classList.add('comments-counter');

  const commentsTitle = document.createElement('h3');
  commentsTitle.classList.add('comment-title');

  const commentsCount = document.createElement('span');
  commentsCount.classList.add('comments-count');

  const commentsList = document.createElement('div');
  commentsList.classList.add('comments-list');

  const commentsForm = document.createElement('form');
  commentsForm.classList.add('comments-form');

  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'Your Name');
  nameInput.classList.add('name-input', 'form-control');

  const commentInput = document.createElement('textarea');
  commentInput.setAttribute('placeholder', 'Your Comment');
  commentInput.classList.add('comment-input', 'form-control');

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('submit-button', 'btn', 'btn-primary');
  submitButton.textContent = 'Submit';

  commentsForm.appendChild(nameInput);
  commentsForm.appendChild(commentInput);
  commentsForm.appendChild(submitButton);

  const overlay = document.createElement('div');
  overlay.classList.add('over-lay');

  document.body.appendChild(overlay);
  popContainer.appendChild(icon);
  popContainer.appendChild(countryFlagEl);
  popContainer.appendChild(countryNameEl);
  popContainer.appendChild(counteryDetail);
  counteryDetail.appendChild(countryPopulationEl);
  counteryDetail.appendChild(countryCapitalEl);
  counteryDetail.appendChild(countryAreaEl);
  counteryDetail.appendChild(countryContinentEl);
  popContainer.appendChild(commentsContainer);
  commentsContainer.appendChild(commentsCounter);
  commentsContainer.appendChild(commentsList);
  commentsCounter.appendChild(commentsTitle);
  commentsCounter.appendChild(commentsCount);
  commentsContainer.appendChild(commentsForm);

  // Add event listener to close the popup when the icon is clicked
  icon.addEventListener('click', () => {
    popContainer.style.display = 'none';
    overlay.style.display = 'none';
  });

  // Make displayfunction to display comment from api to screen
  const displayComment = (comment) => {
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment');

    const commentText = document.createElement('li');
    commentText.classList.add(
      'comment-text',
      'container',
      'custom-container',
      'shadow-sm'
    );

    let commentDate;
    try {
      // Try parsing the date string into a Date object
      commentDate = new Date(comment.creation_date);
    } catch (error) {
      return error.message;
    }

    let commentDateString = '';
    if (commentDate && !isNaN(commentDate)) {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      commentDateString = commentDate.toLocaleDateString(undefined, options);
    }

    const commentInfo = `${commentDateString}  ${
      comment ? comment.username : ''
    }: ${comment ? comment.comment : ''}`;
    commentText.textContent = commentInfo;

    commentEl.appendChild(commentText);
    commentsList.appendChild(commentEl);

    const commentCount = commentsList.querySelectorAll('.comment').length || 0;
    if (commentCount === 0) {
      commentsCount.textContent = 'Comment (0)';
    }
    commentsCount.textContent = `Comment (${commentCount})`;
  };

  // Fetch and display comments
  try {
    const response = await fetch(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/FjhFMUdws0lCxR3eXCdS/comments?item_id=${encodeURIComponent(
        countryDetails.name.common
      )}`
    );
    const comments = await response.json();
    const commentCount = comments.length;
    const commentText =
      commentCount > 0 ? `Comment (${commentCount})` : 'Comment (0)';
    commentsCount.textContent = commentText;
    comments.forEach((comment) => {
      displayComment(comment);
    });
  } catch (error) {
    return error.message;
  }

  commentsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value;
    const comment = commentInput.value;

    if (!name || !comment) {
      return;
    }

    nameInput.value = '';
    commentInput.value = '';

    const currentDate = new Date().toLocaleDateString(); // Save current date in ISO format

    try {
      const response = await fetch(
        `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/FjhFMUdws0lCxR3eXCdS/comments?item_id=${encodeURIComponent(
          countryDetails.name.common
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item_id: countryDetails.name.common,
            username: name,
            comment,
            date: currentDate,
          }),
        }
      );
      if (response.ok) {
        const newComment = {
          username: name,
          comment,
          date: currentDate,
        };
        displayComment(newComment);

        // Fetch and display all comments again
        const commentsResponse = await fetch(
          `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/FjhFMUdws0lCxR3eXCdS/comments?item_id=${encodeURIComponent(
            countryDetails.name.common
          )}`
        );
        const comments = await commentsResponse.json();
        const commentCount = comments.length;
        const commentText =
          commentCount > 0 ? `Comment (${commentCount})` : 'Comment (0)';
        commentsCount.textContent = commentText;

        // Clear the existing comments
        commentsList.innerHTML = '';

        if (commentCount > 0) {
          comments.forEach((comment) => {
            displayComment(comment);
          });
        }
      } else {
        return null;
      }
    } catch (error) {
      return error.message;
    }
  });

  document.body.appendChild(popContainer);
};

// event listenner for comment button

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-commentt')) {
    const countryName = event.target.getAttribute('data-country');

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const [countryDetails] = await response.json();
      await openPopup(countryDetails);
    } catch (error) {
      return error.message;
    }
  }
});
