import {app} from './app';

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Session service listening on port ${port}`);
});
