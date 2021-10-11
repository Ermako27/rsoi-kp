import {app} from './app';

const port = process.env.PORT || 3006;
app.listen(port, () => {
	console.log(`Gateway listening on port ${port}`);
});
