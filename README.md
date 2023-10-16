# Dev Migrations

This is a frontend application that uses D3 and React to display migrations between technologies and providers, with some statistics (how frequently migrations occur, how long they take, and are they successful).

The project may be useful if you are starting a new migration (e.g. Heroku to another provider) and want to do more research before starting the project.

You can visit the project at https://bilbof.com/migrations.

Pay for a month of hosting: https://www.buymeacoffee.com/billfranklin

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

Locally:
```
npm start
```

On server (uses serve, fronted by nginx):
```
# NOTE: changes must be merged into origin/master first
cap production deploy
```