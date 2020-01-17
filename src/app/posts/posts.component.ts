/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '../services/http.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { MapsService } from '../services/map.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @ViewChild('form', {static: false}) form;

  addPostForm: any;
  showImage = 'http://www.greekisrael-chamber.gr/images/NoImgUploaded.gif';
  userImagePath: any;
  error: boolean;
  errorMsg: string;
  loader: boolean;
  allPosts: any;
  userData: any;
  postLiked = false;
  currentUserData: any;
  title = 'maps';
  latitude;
  longitude;
  location;
  zoom: number;
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  locationData: { address: string; country: any; city: any; postalCode: any; businessLocation: { lat: any; lng: any; }; };
  userLocation: any = '';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService,
              public dialog: MatDialog , private map: MapsService, private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {

    this.addPostForm = this.formBuilder.group({
      postMsg : new FormControl('', [Validators.required]),
      postImage : new FormControl('', []),
      searchControl : new FormControl('', [Validators.required])
    });

  }

  ngOnInit() {
    this.getAllPosts();
    const helper = new JwtHelperService();
    this.currentUserData = helper.decodeToken(localStorage.getItem('currentUser'));

    // this.zoom = 4;
    // this.latitude = 39.8282;
    // this.longitude = -98.5795;

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          console.log(typeof(place.geometry.location.lat()))
          this.latitude = +(place.geometry.location.lat());
          this.longitude = +(place.geometry.location.lng());
          this.zoom = 12;

          this.getLocationDetails();
        });
      });
    });
  }


  openDialog(postData, username): void {
    const dialogRef = this.dialog.open(PostCommentComponent, {
      height: '400px',
      width: '500px',
      data : { postData , username}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getAllPosts = () => {
    this.httpService.getAllPosts().subscribe((res) => {
      if (res.success === true) {
        this.allPosts = res.data;
      }
    });
  }

  onFileSelected = (event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.addPostForm.patchValue({postImage : file});
    this.addPostForm.get('postImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.showImage = reader.result as string;
    };
    reader.readAsDataURL(file);
    const fd = new FormData();
    fd.append('file', this.addPostForm.value.postImage, this.addPostForm.value.postImage.name);
    this.httpService.imageUpload(fd).subscribe((res) => {
      if (res.success === true) {
        this.userImagePath = res.data;
      } else {
        this.error = true;
        this.errorMsg = res.message;
      }
    });
  }

  addNewPost = () => {
    this.loader = true;
    if (!this.addPostForm.valid) {
      this.loader = false;
      return false;
    }
    const postData = {
      postMsg : this.addPostForm.value.postMsg,
      postImage : this.userImagePath,
      location : this.userLocation
    };
    this.httpService.addNewPost(postData).subscribe((result) => {
      this.loader = false;
      this.form.resetForm();
      this.showImage = '';
      if (result.success === true) {
        this.getAllPosts();
      } else {
        this.error = true;
        this.errorMsg = result.message;
      }
    });
  }

  likeThePost = (postData, username, index) => {
    const data = {
      postData,
      username
    };
    this.httpService.postLiked(data).subscribe((result) => {
      if (result.success === true) {
        document.getElementById('likeIcon_' + index).setAttribute('class', 'Liked mat-icon material-icons');
      } else {
        document.getElementById('likeIcon_' + index).setAttribute('class', 'notLiked mat-icon material-icons');
      }
    });
  }

  checkLikesInArray = (arr, username) => {
    return _.some(arr, { username });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = parseFloat(position.coords.latitude.toString());
        this.longitude = parseFloat(position.coords.longitude.toString());
        this.zoom = 12;
      });
      this.mapsAPILoader.load().then(() => {
        // tslint:disable-next-line: new-parens
        const geocoder = new google.maps.Geocoder;
        const latlng = {lat: this.latitude, lng: this.longitude};
        // tslint:disable-next-line: only-arrow-functions
        geocoder.geocode({location: latlng}, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0] != null) {
              this.ngZone.run(() => {
                this.userLocation = results[0].formatted_address;
              });
            }
          } else {
            console.log('No results found');
          }
        });
      });
    }
  }

  // geocoder to get location details
  getLocationDetails = () => {
    let country;
    let city;
    let postalCode;
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(this.latitude, this.longitude);
    const request = {
      location: latlng
    };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < results[0].address_components.length; i++) {
            if (results[0].address_components[i].types[0] === 'country') {
              country = results[0].address_components[i].long_name;
            } else {
              if (results[0].address_components[i].types[0] === 'locality') {
                city = results[0].address_components[i].long_name;
              } else {
                if (results[0].address_components[i].types[0] === 'postal_code') {
                  postalCode = results[0].address_components[i].long_name;
                }
              }
            }
          }
          this.locationData = {
            address: results[0].formatted_address,
            country,
            city,
            postalCode,
            businessLocation: {
              lat: this.latitude,
              lng: this.longitude
            }
          };
          this.userLocation = this.locationData.address;
          console.log(this.locationData);
        } else {
          console.log('Location not found');
        }
      } else {
        console.log('error :' + status);
      }
    });
  }

}
