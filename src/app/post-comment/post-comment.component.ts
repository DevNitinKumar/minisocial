import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})
export class PostCommentComponent implements OnInit {
  addCommentForm: any;
  post: any;
  @ViewChild('form', {static: false}) form;
  error: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) public postData: any) {
    this.addCommentForm = this.formBuilder.group({
      postComment : new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.getAllComments();
  }

  addNewComment = () => {
    if (this.addCommentForm.value.postComment === '') {
      this.error = true;
      this.errorMsg = 'Comment Required!!';
      return;
    }
    const data = {
      data : this.postData,
      cmt : this.addCommentForm.value.postComment
    };
    this.httpService.postComment(data).subscribe(res => {
      if (res.success) {
        this.form.resetForm();
        this.getAllComments();
      }
    });
  }

  getAllComments = () => {
    this.httpService.getAllComments(this.postData).subscribe(res => {
      if (res.success) {
        this.post = res.data;
      } else {
        this.error = true;
        this.errorMsg = res.message;
      }
    });
  }

}
