import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userImageUrl: string | undefined;
  userName: string | undefined;
  user = localStorage.getItem('user');
  userId: string = '';

  constructor(private UserService: UserService) {

  }
  ngOnInit(): void {
    if (this.user) {
      const userImage = JSON.parse(this.user)?.user?.ProfileImage;
      this.userImageUrl = `data:image/jpeg;base64,${this.toBase64(userImage.data.data)}`;
      this.userName = JSON.parse(this.user)?.user?.Username;
      this.userId = JSON.parse(this.user)?.user?._id
    }
  }

  private toBase64(arr: any) {
    return btoa(
      arr?.reduce((data: any, byte: any) => data + String.fromCharCode(byte), "")
    );
  }

  onLogout() {
    const user = { userId: this.userId };
    const obs = this.UserService.logoutUser(user);
    obs.subscribe({
      next: (res) => {
        console.log(`User Successfully Logout`, res);
        window.alert(`User Successfully Logout`);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('user');
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
        window.alert("Something went wrong while Logout...");
      }
    });
  }
}
