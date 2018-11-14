import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GrudyService } from 'src/app/services/grudy/grudy.service';
import { Course } from 'src/app/models/Course';

@Component({
  selector: 'app-your-posts',
  templateUrl: './your-posts.component.html',
  styleUrls: ['./your-posts.component.css']
})
export class YourPostsComponent implements OnInit {
  usersPosts: Post[] = null;

  constructor(private grudy: GrudyService, private authService: AuthService) {
    this.grudy.getUsersPosts(this.authService.userDetails.email)
    .then(posts => {
      this.usersPosts = posts;
    })
    .catch(err => {console.log(err);})
  }

  getTopic(course: Course, topicId: string) {
    let name = "";
    for (let topic of course.topics) {
      if (topic._id == topicId) {
        name = topic.name;
        break
      }
    }
    return name;
  }

  ngOnInit() {
  }

}
