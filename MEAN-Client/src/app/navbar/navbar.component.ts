import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userName: string | null = null;
  userImageUrl: string | null = null;
  user = localStorage.getItem('user');
  userId: string = '';
  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }


  constructor(private UserService: UserService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    if (this.user) {
      const userImage = JSON.parse(this.user)?.user?.ProfileImage;
      this.userImageUrl = `data:image/jpeg;base64,${this.toBase64(userImage.data.data)}` || 'favicon.ico';
      this.userName = JSON.parse(this.user)?.user?.Username || 'user';
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
        this.toastr.success('User Successfully Logout');
        localStorage.removeItem('isLogin');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.reload();
        }, 500)
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message);
      }
    });
  }
}
