const {Schema,model} = require("mongoose");

// for compled queries in db
let mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new Schema({

    videoFile:{
        type: String, //cloudnary url
        required: true
    },
    thumbnail:{
        type: String, //cloudnary url
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number,  //cloudnary
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type:Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
 
},{timestamps:true})

// use it before exporting
videoSchema.plugin(mongooseAggregatePaginate);

const Vidoe = model("Video",videoSchema);