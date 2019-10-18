/* Photo upload section */
import React, { Component } from 'react';
import { Icon, Grid, IconGroup, Image, Button } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        const imageId = props.imageId ? props.imageId
            : ""
        const imageSource = props.imageSource ? props.imageSource : ""
        this.state = {
            addedImage: false,
            imageId: imageId,
            //file: null,
            fileImage: '',
            imageSource: imageSource
        }
        this.displayImage = this.displayImage.bind(this)
        this.changeImage = this.changeImage.bind(this)
        this.loadImage = this.loadImage.bind(this)
        this.updateImage = this.updateImage.bind(this)
        this.myPhoto = this.myPhoto.bind(this)
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({
            imageId: nextProps.imageId,
            imageSource: nextProps.imageSource,
        });
    }

    changeImage(event) {
        event.persist();
        console.log(event)
        this.setState({
            fileImage: event.target.files[0],
            addedImage: true,
            imageId: event.target.files[0].name
        })
    }

    loadImage() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/getProfileImage?Id=' + this.state.imageId,
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/getProfileImage?Id=' + this.state.imageId,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                console.log(res)
                this.setState({ imageSource: res.profilePath.result })
                this.props.updateProfileData({ profilePhoto: this.state.imageId, profilePhotoUrl: this.state.imageSource })
            }.bind(this)
        })
    }
    updateImage() {
        let data = new FormData();
        data.append('file', this.state.fileImage);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/updateProfilePhoto',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/updateProfilePhoto',
            headers: {
                'Authorization': 'Bearer ' + cookies,

            },
            type: "POST",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log("inside",res)
                if (res.success == true) {
                    TalentUtil.notification.show("Photo is uploaded sucessfully", "success", null, null)
                    this.setState({ addedImage: false })
                   // this.loadImage();
                    window.location = "/TalentProfile";
                } else {
                    TalentUtil.notification.show("Photo is not uploaded", "Fail", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                //console.log(a)
                //console.log(b)
            }
        })

    }

    displayImage() {
        return (
            <div className="eight wide column">
                <img src={this.state.imageSource} className="ui circular bordered image" onClick={() => this.refs.refImgChanged.click()} />
                <input ref="refImgChanged" hidden type='file' onChange={this.changeImage} />
            </div>)
    }

    myPhoto() {
        let imageUrl = null;
        imageUrl = window.URL.createObjectURL(this.state.fileImage);
        return (
            <div class="eight wide column">
                <div className="field" >
                    <img src={imageUrl} className="ui medium circular bordered image" onClick={() => this.refs.refImgChange.click()} />
                    <input ref="refImgChange" hidden type='file' onChange={this.changeImage} />
                </div>
                <div className="field" >
                    <button type='button' className="ui teal button" onClick={this.updateImage}>
                        <i className="upload icon"/>
                        Upload
                </button>
                </div>
            </div>
        )
    }
 
    render() {
        const { imageId, addedImage } = this.state;
        if (addedImage) {
            return this.myPhoto();
        }
        else
            return (
            <div class="ui center grid">
                {imageId ?
                    this.displayImage()
                    :
                    <div class="column">
                        <Icon name='camera retro' size='massive' onClick={() => this.refs.refImg.click()}></Icon>
                            <input ref="refImg" hidden type='file' onChange={this.changeImage} />
                    </div>
                }
            </div>

        )
    }
}
