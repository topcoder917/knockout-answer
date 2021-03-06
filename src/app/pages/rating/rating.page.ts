import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { Location } from "@angular/common";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RatingService } from '../../services/rating/rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  service_request : any;
  rating = 0;
  rating_readonly = false;
  validationsform: FormGroup;
  showSubmitBtn = false;
  ratingList = [];
  isLoading = false;
  constructor(
    private router: Router,
    public ratingService: RatingService,
    private route: ActivatedRoute,
    public menuCtrl: MenuController,
    private location: Location,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.service_request = this.router.getCurrentNavigation().extras.state.service_request;
      }
    });
    this.validationsform = this.formBuilder.group({
      feedback_text: new FormControl('', Validators.compose([
        Validators.required
      ])),
      starRating: new FormControl()
    });
    //this.getRatingByRequstId();

  }
  logRatingChange(rating){
    console.log("changed rating: ",rating);
    this.rating = rating;
    // do your stuff
  }

  async tryProvideFeedback(value){
    this.service_request.marks = this.rating;
    this.service_request.feedback_text = value.feedback_text;
    const loading = await this.loadingController.create({
      message: 'Submitting...',
    });
    await loading.present();
    this.ratingService.submitFeedback(this.service_request).subscribe( resp => {
      loading.dismiss();
      this.router.navigate(['/tablinks/home']);

    },
    (err) => {
      loading.dismiss();
    });
  }

  back(){
    this.router.navigate(['/tablinks/home']);
  }
  openMenu() {
    this.menuCtrl.enable(true, 'customMenu');
    this.menuCtrl.open('customMenu');
  }
}
