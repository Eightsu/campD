app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground });
		}
	});
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			console.log(req.body.comment);
			// eslint-disable-next-line no-shadow
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					// eslint-disable-next-line no-underscore-dangle
					res.redirect(`/campgrounds/${campground._id}`);
				}
			});
		}
	});
});