
async shareApp() {
    
    const shareRet = await Share.share({
        title: this.translate.instant('share.title'),
        text: this.translate.instant('share.text'),
    });

    const message = this.translate.instant('parameter-string', { parameter });

    // MULTILINE TEST
    const testMessage = this.translate.instant('account.friendRequestAcceptSuccess', {
        user: displayName
    });
    alert(this.translate.instant('account.friendRequestAcceptSuccess'));

}