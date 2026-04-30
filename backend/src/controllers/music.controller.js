const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const {uploadFile} = require("../services/storage.service");

function normalizeMusicIds(input) {
    if (Array.isArray(input)) {
        return input.filter(Boolean);
    }

    if (typeof input === "string") {
        return input
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
    }

    return [];
}

async function createMusic(req,res) {
    const {title} = req.body;
    const file = req.file;

    if (!title?.trim()) {
        return res.status(400).json({
            message: "Title is required"
        })
    }

    if (!file) {
        return res.status(400).json({
            message: "Music file is required"
        })
    }

    const result = await uploadFile(file.buffer.toString('base64'))

    const music= await musicModel.create({
        uri: result.url,
        title: title.trim(),
        artist: req.user.id,
    })

    await music.populate("artist", "username email")

    res.status(201).json({
        message:"Music created successfully",
        music:{
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    })
}

async function createAlbum(req,res){

    const {title, musics} = req.body;
    const musicIds = normalizeMusicIds(musics);

    if (!title?.trim()) {
        return res.status(400).json({
            message: "Album title is required"
        })
    }

    if (!musicIds.length) {
        return res.status(400).json({
            message: "Select at least one music track"
        })
    }

    const ownedMusics = await musicModel.find({
        _id: { $in: musicIds },
        artist: req.user.id,
    }).select("_id");

    if (ownedMusics.length !== musicIds.length) {
        return res.status(400).json({
            message: "Album can only include your own music"
        })
    }

    const album = await albumModel.create({
        title: title.trim(),
        artist: req.user.id,
        musics: musicIds,
    })

    await album.populate("artist", "username email")
    await album.populate("musics")

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })
}

async function getAllMusic(req,res){
    const musics = await musicModel
    .find()
    .limit(20)
    .populate("artist","username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })
}

async function getAllAlbums(req, res){
    const albums= await albumModel
    .find()
    .limit(20)
    .select("title artist musics").populate("artist","username email")

    res.status(200).json({
        message: "Albums getched successfully",
        albums: albums,
    })
}

async function getAlbumById(req, res){
    const albumId= req.params.albumId;

    const album = await albumModel.findById(albumId)
    .limit(20)
    .populate("artist", "username email").populate("musics")

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })
}
module.exports={ createMusic, createAlbum,getAllMusic,getAllAlbums,getAlbumById}
