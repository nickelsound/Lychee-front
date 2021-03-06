/**
 * @description This module is used to generate HTML-Code.
 */

let build = {};

build.iconic = function (icon, classes = '') {

	let html = '';

	html += lychee.html`<svg class='iconic ${classes}'><use xlink:href='#${icon}' /></svg>`;

	return html

};

build.divider = function (title) {

	let html = '';

	html += lychee.html`<div class='divider'><h1>${title}</h1></div>`;

	return html

};

build.editIcon = function (id) {

	let html = '';

	html += lychee.html`<div id='${id}' class='edit'>${build.iconic('pencil')}</div>`;

	return html

};

build.multiselect = function (top, left) {

	return lychee.html`<div id='multiselect' style='top: ${top}px; left: ${left}px;'></div>`

};

build.getAlbumThumb = function (data, i) {
	let isVideo = data.types[i] && data.types[i].indexOf('video') > -1;
	let isRaw = data.types[i] && data.types[i].indexOf('raw') > -1;
	let thumb = data.thumbs[i];

	if (thumb === 'uploads/thumb/' && isVideo) {
		return `<span class="thumbimg"><img src='img/play-icon.png' alt='Photo thumbnail' data-overlay='false' draggable='false'></span>`
	}
	if (thumb === 'uploads/thumb/' && isRaw) {
		return `<span class="thumbimg"><img src='img/placeholder.png' alt='Photo thumbnail' data-overlay='false' draggable='false'></span>`
	}

	thumb2x = '';
	if (data.thumbs2x) {
		if (data.thumbs2x[i]) {
			thumb2x = data.thumbs2x[i]
		}
	} else { // Fallback code for Lychee v3
		var {path: thumb2x, isPhoto: isPhoto} = lychee.retinize(data.thumbs[i])
		if (!isPhoto) {
			thumb2x = ''
		}
	}

	return `<span class="thumbimg${isVideo ? ' video' : ''}"><img class='lazyload' src='img/placeholder.png' data-src='${thumb}' ${(thumb2x !== '') ? 'data-srcset=\'' + thumb2x + ' 2x\'' : ''} alt='Photo thumbnail' data-overlay='false' draggable='false'></span>`
};

build.album = function (data, disabled = false) {
	let html = '';
	let date_stamp = data.sysdate;
	let sortingAlbums = [];

	// In the special case of take date sorting use the take stamps as title
	if (lychee.sortingAlbums !== '' && data.min_takestamp && data.max_takestamp) {

		sortingAlbums = lychee.sortingAlbums.replace('ORDER BY ', '').split(' ');
		if (sortingAlbums[0] === 'max_takestamp' || sortingAlbums[0] === 'min_takestamp') {
			if (data.min_takestamp !== '' && data.max_takestamp !== '') {
				date_stamp = (data.min_takestamp === data.max_takestamp ? data.max_takestamp : data.min_takestamp + ' - ' + data.max_takestamp)
			} else if (data.min_takestamp !== '' && sortingAlbums[0] === 'min_takestamp') {
				date_stamp = data.min_takestamp
			} else if (data.max_takestamp !== '' && sortingAlbums[0] === 'max_takestamp') {
				date_stamp = data.max_takestamp
			}
		}
	}

	html += lychee.html`
			<div class='album ${(disabled ? `disabled` : ``)}' data-id='${data.id}' data-tabindex='${tabindex.get_next_tab_index()}'>
				  ${build.getAlbumThumb(data, 2)}
				  ${build.getAlbumThumb(data, 1)}
				  ${build.getAlbumThumb(data, 0)}
				<div class='overlay'>
					<h1 title='$${data.title}'>$${data.title}</h1>
					<a>$${date_stamp}</a>
				</div>
			`;

	if (album.isUploadable() && !disabled) {

		html += lychee.html`
				<div class='badges'>
					<a class='badge ${(data.star === '1' ? 'badge--star' : '')} icn-star'>${build.iconic('star')}</a>
					<a class='badge ${(data.public === '1' ? 'badge--visible' : '')} ${(data.visible === '1' ? 'badge--not--hidden' : 'badge--hidden')} icn-share'>${build.iconic('eye')}</a>
					<a class='badge ${(data.unsorted === '1' ? 'badge--visible' : '')}'>${build.iconic('list')}</a>
					<a class='badge ${(data.recent === '1' ? 'badge--visible badge--list' : '')}'>${build.iconic('clock')}</a>
					<a class='badge ${(data.password === '1' ? 'badge--visible' : '')}'>${build.iconic('lock-locked')}</a>
					<a class='badge ${(data.tag_album === '1' ? 'badge--tag' : '')}'>${build.iconic('tag')}</a>
				</div>
				`

	}

	if ((data.albums && data.albums.length > 0) || (data.hasOwnProperty('has_albums') && data.has_albums === '1')) {
		html += lychee.html`
				<div class='subalbum_badge'>
					<a class='badge badge--folder'>${build.iconic('layers')}</a>
				</div>`;
	}

	html += '</div>';

	return html

};

build.photo = function (data, disabled = false) {

	let html = '';
	let thumbnail = '';
	var thumb2x = '';

	let isVideo = data.type && data.type.indexOf('video') > -1;
	let isRaw = data.type && data.type.indexOf('raw') > -1;
	let isLivePhoto = (data.livePhotoUrl!=='' && data.livePhotoUrl!==null);

	if (data.thumbUrl === 'uploads/thumb/' && isLivePhoto) {
		thumbnail = `<span class="thumbimg"><img src='img/live-photo-icon.png' alt='Photo thumbnail' data-overlay='false' draggable='false' data-tabindex='${tabindex.get_next_tab_index()}'></span>`
	}
	if (data.thumbUrl === 'uploads/thumb/' && isVideo) {
		thumbnail = `<span class="thumbimg"><img src='img/play-icon.png' alt='Photo thumbnail' data-overlay='false' draggable='false' data-tabindex='${tabindex.get_next_tab_index()}'></span>`
	} else if (data.thumbUrl === 'uploads/thumb/' && isRaw) {
		thumbnail = `<span class="thumbimg"><img src='img/placeholder.png' alt='Photo thumbnail' data-overlay='false' draggable='false' data-tabindex='${tabindex.get_next_tab_index()}'></span>`
	} else if (lychee.layout === '0') {

		if (data.hasOwnProperty('thumb2x')) { // Lychee v4
			thumb2x = data.thumb2x
		} else { // Lychee v3
			var {path: thumb2x} = lychee.retinize(data.thumbUrl)
		}

		if (thumb2x !== '') {
			thumb2x = `data-srcset='${thumb2x} 2x'`
		}

		thumbnail = `<span class="thumbimg${isVideo ? ' video' : ''}${isLivePhoto ? ' livephoto' : ''}">`;
		thumbnail += `<img class='lazyload' src='img/placeholder.png' data-src='${data.thumbUrl}' ` + thumb2x + ` alt='Photo thumbnail' data-overlay='false' draggable='false' >`;
		thumbnail += `</span>`
	} else {

		if (data.small !== '') {
			if (data.hasOwnProperty('small2x') && data.small2x !== '') {
				thumb2x = `data-srcset='${data.small} ${parseInt(data.small_dim, 10)}w, ${data.small2x} ${parseInt(data.small2x_dim, 10)}w'`
			}

			thumbnail = `<span class="thumbimg${isVideo ? ' video' : ''}${isLivePhoto ? ' livephoto' : ''}">`;
			thumbnail += `<img class='lazyload' src='img/placeholder.png' data-src='${data.small}' ` + thumb2x + ` alt='Photo thumbnail' data-overlay='false' draggable='false' >`;
			thumbnail += `</span>`
		} else if (data.medium !== '') {
			if (data.hasOwnProperty('medium2x') && data.medium2x !== '') {
				thumb2x = `data-srcset='${data.medium} ${parseInt(data.medium_dim, 10)}w, ${data.medium2x} ${parseInt(data.medium2x_dim, 10)}w'`
			}

			thumbnail = `<span class="thumbimg${isVideo ? ' video' : ''}${isLivePhoto ? ' livephoto' : ''}">`;
			thumbnail += `<img class='lazyload' src='img/placeholder.png' data-src='${data.medium}' ` + thumb2x + ` alt='Photo thumbnail' data-overlay='false' draggable='false' >`
			thumbnail += `</span>`
		} else if (!isVideo) {
			// Fallback for images with no small or medium.
			thumbnail = `<span class="thumbimg${isLivePhoto ? ' livephoto' : ''}">`;
			thumbnail += `<img class='lazyload' src='img/placeholder.png' data-src='${data.url}' alt='Photo thumbnail' data-overlay='false' draggable='false' >`;
			thumbnail += `</span>`
		} else {
			// Fallback for videos with no small (the case of no thumb is
			// handled at the top of this function).

			if (data.hasOwnProperty('thumb2x')) { // Lychee v4
				thumb2x = data.thumb2x
			} else { // Lychee v3
				var {path: thumb2x} = lychee.retinize(data.thumbUrl)
			}

			if (thumb2x !== '') {
				thumb2x = `data-srcset='${data.thumbUrl} 200w, ${thumb2x} 400w'`
			}

			thumbnail = `<span class="thumbimg video">`;
			thumbnail += `<img class='lazyload' src='img/placeholder.png' data-src='${data.thumbUrl}' ` + thumb2x + ` alt='Photo thumbnail' data-overlay='false' draggable='false' >`;
			thumbnail += `</span>`
		}

	}

	html += lychee.html`
			<div class='photo ${(disabled ? `disabled` : ``)}' data-album-id='${data.album}' data-id='${data.id}' data-tabindex='${tabindex.get_next_tab_index()}'>
				${thumbnail}
				<div class='overlay'>
					<h1 title='$${data.title}'>$${data.title}</h1>
			`;

	if (data.takedate !== '') html += lychee.html`<a><span title='Camera Date'>${build.iconic('camera-slr')}</span>${data.takedate}</a>`;
	else html += lychee.html`<a>${data.sysdate}</a>`;

	html += `</div>`;

	if (album.isUploadable()) {

		html += lychee.html`
				<div class='badges'>
					<a class='badge ${(data.star === '1' ? 'badge--star' : '')} icn-star'>${build.iconic('star')}</a>
					<a class='badge ${((data.public === '1' && album.json.public !== '1') ? 'badge--visible badge--hidden' : '')} icn-share'>${build.iconic('eye')}</a>
				</div>
				`

	}

	html += `</div>`;

	return html

};

build.overlay_image = function (data) {
	let exifHash = data.make + data.model + data.shutter + data.aperture + data.focal + data.iso;

	// Get the stored setting for the overlay_image
	let type = lychee.image_overlay_type;
	let html = ``;

	if (type && type === 'desc' && data.description !== '') {
		html = lychee.html`
					<div id="image_overlay">
						<h1>$${data.title}</h1>
						<p>$${data.description}</p>
					</div>
				`;
	} else if (type && type === 'takedate' && data.takedate !== '') {
		html = lychee.html`
			<div id="image_overlay">
				<h1>$${data.title}</h1>
				<p>${data.takedate}</p>
			</div>
		`
	}
	// fall back to exif data if there is no description
	else if (exifHash !== '') {

		html += lychee.html`
			<div id="image_overlay"><h1>$${data.title}</h1>
			<p>${data.shutter.replace('s', 'sec')} at ${data.aperture.replace('f/', '&fnof; / ')}, ${lychee.locale['PHOTO_ISO']} ${data.iso}<br>
			${data.focal} ${(data.lens && data.lens !== '') ? '(' + data.lens + ')' : ''}</p>
			</div>
		`;
	}

	return html;
};

build.imageview = function (data, visibleControls, autoplay) {

	let html = '';
	let thumb = '';

	if (data.type.indexOf('video') > -1) {
		html += lychee.html`<video width="auto" height="auto" id='image' controls class='${visibleControls === true ? '' : 'full'}' autobuffer ${autoplay ? 'autoplay' : ''} data-tabindex='${tabindex.get_next_tab_index()}'><source src='${data.url}'>Your browser does not support the video tag.</video>`
	} else if (data.type.indexOf('raw') > -1 && data.medium === '') {
		html += lychee.html`<img id='image' class='${visibleControls === true ? '' : 'full'}' src='img/placeholder.png' draggable='false' alt='big' data-tabindex='${tabindex.get_next_tab_index()}'>`
	} else {
		let img = '';

		if(data.livePhotoUrl === '' || data.livePhotoUrl === null) {
			// It's normal photo

			// See if we have the thumbnail loaded...
			$('.photo').each(function () {
				if ($(this).attr('data-id') && $(this).attr('data-id') == data.id) {
					let thumbimg = $(this).find('img');
					if (thumbimg.length > 0) {
						thumb = thumbimg[0].currentSrc ? thumbimg[0].currentSrc : thumbimg[0].src;
						return false
					}
				}
			});

			if (data.medium !== '') {
				let medium = '';

				if (data.hasOwnProperty('medium2x') && data.medium2x !== '') {
					medium = `srcset='${data.medium} ${parseInt(data.medium_dim, 10)}w, ${data.medium2x} ${parseInt(data.medium2x_dim, 10)}w'`;
				}
				img = `<img id='image' class='${visibleControls === true ? '' : 'full'}' src='${data.medium}' ` + medium + `  draggable='false' alt='medium' data-tabindex='${tabindex.get_next_tab_index()}'>`

			} else {
				img = `<img id='image' class='${visibleControls === true ? '' : 'full'}' src='${data.url}' draggable='false' alt='big' data-tabindex='${tabindex.get_next_tab_index()}'>`
			}
		} else {

			if (data.medium !== '') {
				let medium_dims = data.medium_dim.split("x");
				let medium_width = medium_dims[0];
				let medium_height = medium_dims[1];
				// It's a live photo
				img = `<div id='livephoto' data-live-photo data-proactively-loads-video='true' data-photo-src='${data.medium}' data-video-src='${data.livePhotoUrl}'  style='width: ${medium_width}px; height: ${medium_height}px' data-tabindex='${tabindex.get_next_tab_index()}'></div>`

			} else {
				// It's a live photo
				img = `<div id='livephoto' data-live-photo data-proactively-loads-video='true' data-photo-src='${data.url}' data-video-src='${data.livePhotoUrl}'  style='width: ${data.width}px; height: ${data.height}px' data-tabindex='${tabindex.get_next_tab_index()}'></div>`
			}

		}


		html += lychee.html`${img}`;

		if (lychee.image_overlay) html += build.overlay_image(data);
	}

	html += `
			<div class='arrow_wrapper arrow_wrapper--previous'><a id='previous'>${build.iconic('caret-left')}</a></div>
			<div class='arrow_wrapper arrow_wrapper--next'><a id='next'>${build.iconic('caret-right')}</a></div>
			`;

	return { html, thumb }

};

build.no_content = function (typ) {

	let html = '';

	html += lychee.html`<div class='no_content fadeIn'>${build.iconic(typ)}`;

	switch (typ) {
		case 'magnifying-glass':
			html += lychee.html`<p>${lychee.locale['VIEW_NO_RESULT']}</p>`;
			break;
		case 'eye':
			html += lychee.html`<p>${lychee.locale['VIEW_NO_PUBLIC_ALBUMS']}</p>`;
			break;
		case 'cog':
			html += lychee.html`<p>${lychee.locale['VIEW_NO_CONFIGURATION']}</p>`;
			break;
		case 'question-mark':
			html += lychee.html`<p>${lychee.locale['VIEW_PHOTO_NOT_FOUND']}</p>`;
			break
	}

	html += `</div>`;

	return html

};

build.uploadModal = function (title, files) {

	let html = '';

	html += lychee.html`
			<h1>$${title}</h1>
			<div class='rows'>
			`;

	let i = 0;

	while (i < files.length) {

		let file = files[i];

		if (file.name.length > 40) file.name = file.name.substr(0, 17) + '...' + file.name.substr(file.name.length - 20, 20);

		html += lychee.html`
				<div class='row'>
					<a class='name'>${file.name}</a>
					<a class='status'></a>
					<p class='notice'></p>
				</div>
				`;

		i++

	}

	html += `</div>`;

	return html

};

build.uploadNewFile = function (name) {

	if (name.length > 40) {
		name = name.substr(0, 17) + '...' + name.substr(name.length - 20, 20)
	}

	return lychee.html`
		<div class='row'>
			<a class='name'>${name}</a>
			<a class='status'></a>
			<p class='notice'></p>
		</div>
		`
};

build.tags = function (tags) {

	let html = '';
	let editable  = (typeof album !== 'undefined') ? album.isUploadable() : false;

	// Search is enabled if logged in (not publicMode) or public seach is enabled
	let searchable = (lychee.publicMode===false || lychee.public_search===true);

	// build class_string for tag
	let a_class = 'tag';
	if (searchable) {
		a_class = a_class + ' search';
	}

	if (tags !== '') {

		tags = tags.split(',');

		tags.forEach(function (tag, index) {
			if(editable) {
				html += lychee.html`<a class='${a_class}'>$${tag}<span data-index='${index}'>${build.iconic('x')}</span></a>`
			} else {
				html += lychee.html`<a class='${a_class}'>$${tag}</a>`
			}

		})

	} else {

		html = lychee.html`<div class='empty'>${lychee.locale['NO_TAGS']}</div>`

	}

	return html

};

build.user = function (user) {
	let html = lychee.html`<div class="users_view_line">
			<p id="UserData${user.id}">
			<input name="id" type="hidden" value="${user.id}" />
			<input class="text" name="username" type="text" value="$${user.username}" placeholder="username" />
			<input class="text" name="password" type="text" placeholder="new password" />
			<span class="choice" title="Allow uploads">
			<label>
			<input type="checkbox" name="upload" />
			<span class="checkbox"><svg class="iconic "><use xlink:href="#check"></use></svg></span>
			</label>
			</span>
			<span class="choice" title="Restricted account">
			<label>
			<input type="checkbox" name="lock" />
			<span class="checkbox"><svg class="iconic "><use xlink:href="#check"></use></svg></span>
			</label>
			</span>
			</p>
			<a id="UserUpdate${user.id}"  class="basicModal__button basicModal__button_OK">Save</a>
			<a id="UserDelete${user.id}"  class="basicModal__button basicModal__button_DEL">Delete</a>
		</div>
		`;

	return html;
};
