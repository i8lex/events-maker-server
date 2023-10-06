import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { User } from './user.schema';

@Injectable()
export class UserResponseService {
  isConnectedUtil(user: User, currentUser: User): string {
    const userIsConnectedToCurrentUser = user.connects?.includes(
      currentUser?._id,
    );
    const currentUserIsConnectedToUser = currentUser.connects?.includes(
      user?._id,
    );

    if (userIsConnectedToCurrentUser && currentUserIsConnectedToUser) {
      return 'true';
    } else if (userIsConnectedToCurrentUser) {
      return 'request';
    } else if (currentUserIsConnectedToUser) {
      return 'response';
    } else {
      return 'false';
    }
  }
  getAge = (birthday: string) => {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    const dateParts = birthday.split('.')!;
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthName = months[birthDate.getMonth()];
    return `${day} ${monthName}, ${age}`;
  };
  getUsersForResponse = (users: User[], currentUser: User) => {
    return users.map((user) => {
      const isConnected = this.isConnectedUtil(user, currentUser);
      const userToResponse: UserDTO = {};
      userToResponse.isConnect = this.isConnectedUtil(user, currentUser);
      if (
        (user.isBirthdayShowing === 'true' ||
          (user.isBirthdayShowing === 'connect' && isConnected === 'true')) &&
        user.birthday
      ) {
        userToResponse.birthday = this.getAge(user.birthday);
      }
      if (
        (user.isAboutShowing === 'true' ||
          (user.isAboutShowing === 'connect' && isConnected === 'true')) &&
        user.about
      ) {
        userToResponse.about = user.about;
      }
      if (
        (user.isGenderShowing === 'true' ||
          (user.isGenderShowing === 'connect' && isConnected === 'true')) &&
        user.gender
      ) {
        userToResponse.gender = user.gender;
      }
      if (
        (user.isRoleShowing === 'true' ||
          (user.isRoleShowing === 'connect' && isConnected === 'true')) &&
        user.role
      ) {
        userToResponse.role = user.role;
      }
      if (
        (user.isCompanyShowing === 'true' ||
          (user.isCompanyShowing === 'connect' && isConnected === 'true')) &&
        user.company
      ) {
        userToResponse.company = user.company;
      }
      if (user.firstname) {
        userToResponse.firstname = user.firstname;
      }
      if (user.lastname) {
        userToResponse.lastname = user.lastname;
      }

      if (user.avatar) {
        userToResponse.avatar = user.avatar;
      }
      userToResponse._id = user._id;
      userToResponse.name = user.name;
      userToResponse.isOnline = user.isOnline;
      return userToResponse;
    });
  };
}
