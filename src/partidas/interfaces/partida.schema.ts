import * as mongoose from "mongoose";

export const PartidaSchema = new mongoose.Schema({
    desafio: mongoose.Schema.Types.ObjectId,
    categoria: mongoose.Schema.Types.ObjectId,
    jogadores: [{ type: mongoose.Schema.Types.ObjectId }],
    def: mongoose.Schema.Types.ObjectId,
    resultado: [{ set: String }]
}, {timestamps: true, collection: 'partidas'});