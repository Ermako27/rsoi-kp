import {app} from './app';

const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log(`Hotel service listening on port ${port}`);
});
