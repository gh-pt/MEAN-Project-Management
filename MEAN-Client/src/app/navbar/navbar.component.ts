import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Use a property to hold the image URL
  userImageUrl: string | undefined;
  userName: string | undefined;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userImage = JSON.parse(user)?.user?.ProfileImage;
      console.log(userImage)
      this.userImageUrl = `data:image/jpeg;base64,${this.toBase64(userImage.data.data)}`;
      this.userName = JSON.parse(user)?.user?.Username;

    } else {
      // handle the case where 'user' is null
    }

  }

  private toBase64(arr: any) {
    return btoa(
      arr?.reduce((data: any, byte: any) => data + String.fromCharCode(byte), "")
    );
  }
}
